import type { Metadata } from "next";
import Link from "next/link";
import { getArticlesByTag, getAllTags } from "@/lib/mdx";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag: tag.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Articles tagged "${tag}"`,
    description: `Browse all articles tagged with "${tag}" on Zeqqat.`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const articles = getArticlesByTag(tag);

  return (
    <div>
      <div className="mb-10">
        <Link
          href="/i"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
        >
          ← All articles
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tag: {tag}
        </h1>
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No articles with this tag yet.
        </p>
      ) : (
        <div className="space-y-8">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0"
            >
              <Link href={`/i/${article.slug}`} className="block">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <time dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>·</span>
                  <span>{article.readingTime}</span>
                  <span>·</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {article.category}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {article.description}
                </p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
