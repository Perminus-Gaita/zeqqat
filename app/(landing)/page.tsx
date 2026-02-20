import Link from "next/link";
import { ArrowRight, Trophy, Save, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            Free Jackpot Picks Tester
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Test Your SportPesa Jackpot Picks Risk Free
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Save your multiple jackpot predictions and see how they perform after the results come out. No money needed. Just your picks and your gut.
          </p>

          <Link
            href="/jackpots"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
          >
            Start Picking
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pick Your Winners</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Go through each match and select Home, Draw, or Away. Build as many prediction sets as you want.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Save className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Save Your Picks</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Save multiple prediction sets and keep track of all your different strategies without spending a shilling.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">See Your Results</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              After the games finish, see how your picks performed. Learn what works and refine your approach.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Already have picks in mind?
          </p>
          <Link
            href="/jackpots"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Go to Jackpot Picks &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
