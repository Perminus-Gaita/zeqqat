"use client";
import React from 'react';
import { ArrowLeft, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PatternsPage = () => {
  const router = useRouter();

  const detailedPatterns = [
    {
      category: "Goal Difference Patterns",
      icon: <Target className="w-6 h-6" />,
      stats: [
        { label: "2+ goal difference wins", value: "68%", trend: "+12% vs previous season" },
        { label: "1 goal difference wins", value: "24%", trend: "-3% vs previous season" },
        { label: "3+ goal difference wins", value: "18%", trend: "+5% vs previous season" },
      ]
    },
    {
      category: "Draw Patterns",
      icon: <TrendingUp className="w-6 h-6" />,
      stats: [
        { label: "0-0 draws", value: "28%", trend: "Most common" },
        { label: "1-1 draws", value: "44%", trend: "Highest frequency" },
        { label: "2-2+ draws", value: "28%", trend: "Less common" },
      ]
    },
    {
      category: "Favorite Performance",
      icon: <Award className="w-6 h-6" />,
      stats: [
        { label: "Home favorites won", value: "45%", trend: "Strong" },
        { label: "Away favorites won", value: "31%", trend: "Moderate" },
        { label: "Favorites drew", value: "24%", trend: "Surprising" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Chat</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Winning Patterns Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Deep dive into historical jackpot patterns and trends
          </p>
        </div>

        {/* Detailed Patterns */}
        <div className="space-y-6">
          {detailedPatterns.map((pattern, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {pattern.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {pattern.category}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pattern.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Insights */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Key Insights
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• High-scoring matches (2+ goals) show stronger win patterns</li>
                <li>• Most draws occur in low-scoring games (under 2 total goals)</li>
                <li>• Home favorites have a 14% higher win rate than away favorites</li>
                <li>• Goal difference is a stronger predictor than odds alone</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternsPage;
