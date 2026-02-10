import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getArticleBySlug } from "@/lib/mdx";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Pre-generate all article pages at build time
export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.updated || article.date,
      tags: article.tags,
      ...(article.image && { images: [{ url: article.image, alt: article.imageAlt || article.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      ...(article.image && { images: [article.image] }),
    },
  };
}

// ─── Interactive Component Registry ───
// Add your interactive components here.
// In MDX files, use them like: <ImpliedProbability />
const InteractiveWrapper = dynamic(
  () => import("@/components/interactive/common/InteractiveWrapper")
);
const ImpliedProbability = dynamic(
  () => import("@/components/interactive/odds/ImpliedProbability")
);

const mdxComponents = {
  InteractiveWrapper,
  ImpliedProbability,
  // Add more as you build them:
  // OddsCalculator: dynamic(() => import("@/components/interactive/odds/OddsCalculator")),
  // FormChart: dynamic(() => import("@/components/interactive/stats/FormChart")),
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  // JSON-LD structured data for Google rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updated || article.date,
    author: {
      "@type": "Organization",
      name: "App Nyumbani",
    },
    ...(article.image && { image: article.image }),
  };

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-none">
        {/* Article header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{article.readingTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {article.title}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400">
            {article.description}
          </p>

          <div className="flex gap-2 mt-4">
            <Link
              href={`/i/category/${article.category.toLowerCase()}`}
              className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              {article.category}
            </Link>
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/i/tag/${tag.toLowerCase()}`}
                className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        {/* Article content */}
        <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 dark:prose-a:text-blue-400">
          <MDXRemote source={article.content} components={mdxComponents} />
        </div>
      </article>
    </>
  );
}
