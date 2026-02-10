import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content/articles");

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  author?: string;
  published: boolean;
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string;
  readingTime: string;
}

export interface Article extends ArticleMeta {
  content: string;
}

/**
 * Get all article slugs (for generateStaticParams)
 */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Get article metadata + content by slug
 */
export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as ArticleFrontmatter;

  if (!frontmatter.published) return null;

  const stats = readingTime(content);

  return {
    ...frontmatter,
    slug,
    readingTime: stats.text,
    content,
  };
}

/**
 * Get all published articles sorted by date (newest first)
 */
export function getAllArticles(): ArticleMeta[] {
  const slugs = getAllSlugs();

  const articles = slugs
    .map((slug) => {
      const article = getArticleBySlug(slug);
      if (!article) return null;

      // Return metadata only (no content)
      const { content, ...meta } = article;
      return meta;
    })
    .filter((article): article is ArticleMeta => article !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return articles;
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter(
    (article) => article.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get articles by tag
 */
export function getArticlesByTag(tag: string): ArticleMeta[] {
  return getAllArticles().filter((article) =>
    article.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const articles = getAllArticles();
  const categories = new Set(articles.map((a) => a.category));
  return Array.from(categories);
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const articles = getAllArticles();
  const tags = new Set(articles.flatMap((a) => a.tags));
  return Array.from(tags);
}
