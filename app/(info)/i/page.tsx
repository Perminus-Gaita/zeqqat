import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles, getAllCategories } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "App Nyumbani — Data-Driven Betting Research",
  description:
    "Research tools and insights for smarter betting. Define your strategy, test it with data, and make informed decisions.",
};

export default function BlogHomePage() {
  const articles = getAllArticles();
  const categories = getAllCategories();

  // Split into featured (first article) and rest
  const featured = articles[0] || null;
  const recent = articles.slice(1);

  return (
    <div>
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          App Nyumbani
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Data-driven insights for smarter betting research. No predictions, no tips — just tools to test your own logic.
        </p>
      </div>

      {/* Featured Article */}
      {featured && (
        <section className="mb-12">
          <Link href={`/i/${featured.slug}`} className="block group">
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  Featured
                </span>
                <span>·</span>
                <time dateTime={featured.date}>
                  {new Date(featured.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{featured.readingTime}</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                {featured.title}
              </h2>

              <p className="text-gray-600 dark:text-gray-400">
                {featured.description}
              </p>

              <div className="flex gap-2 mt-4">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 flex-wrap">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/i/category/${category.toLowerCase()}`}
                className="text-sm px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Articles */}
      {recent.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Recent Articles
          </h2>

          <div className="space-y-8">
            {recent.map((article) => (
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

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {article.description}
                  </p>

                  <div className="flex gap-2 mt-3">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {articles.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          Articles coming soon. Check back shortly!
        </p>
      )}
    </div>
  );
}
