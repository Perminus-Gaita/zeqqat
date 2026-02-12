import Link from "next/link";
import { BookOpen, TrendingUp, Award, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const featuredArticles = [
    {
      title: "Ultimate Guide to SportPesa Jackpot",
      description: "Complete guide to understanding and winning SportPesa's mega and midweek jackpots",
      href: "/i/ultimate-guide-sportpesa-jackpot",
    },
    {
      title: "How to Predict Draws",
      description: "Data-driven techniques for identifying draw patterns in jackpot matches",
      href: "/i/how-to-predict-draws",
    },
    {
      title: "What Is Value Betting?",
      description: "Learn how to find edges the bookmakers miss using probability and data",
      href: "/i/what-is-value-betting",
    },
  ];

  const categories = [
    {
      title: "Strategies",
      description: "Prediction techniques and approaches",
      icon: TrendingUp,
      href: "/i",
    },
    {
      title: "Winners",
      description: "Success stories and lessons learned",
      icon: Award,
      href: "/i",
    },
    {
      title: "Analysis",
      description: "Data-driven insights and patterns",
      icon: BarChart3,
      href: "/i",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Master SportPesa Jackpot with Data-Driven Research
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Free guides, strategies, and analysis to help you make smarter betting decisions
        </p>
        <Link
          href="/i"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <BookOpen className="w-5 h-5" />
          Browse All Guides
        </Link>
      </div>

      {/* Featured Articles */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Featured Guides
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="group block p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {article.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Browse by Category
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.title}
                href={category.href}
                className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Value Propositions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 mb-16">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Data-driven analysis
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Free tools & calculators
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Learn from real winners
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">🇰🇪</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Kenya-focused research
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to improve your jackpot strategy?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/i/ultimate-guide-sportpesa-jackpot"
            className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors font-medium"
          >
            Start with the Basics
          </Link>
          <Link
            href="/i"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            See All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
