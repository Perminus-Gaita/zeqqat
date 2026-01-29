"use client";
import React from 'react';
import { ArrowLeft, Home, Minus, Plane, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

const OutcomesPage = () => {
  const router = useRouter();

  const weeklyBreakdown = [
    { week: "Week 1", homeWins: 6, draws: 3, awayWins: 4 },
    { week: "Week 2", homeWins: 5, draws: 5, awayWins: 3 },
    { week: "Week 3", homeWins: 7, draws: 2, awayWins: 4 },
    { week: "Week 4", homeWins: 8, draws: 4, awayWins: 5 },
  ];

  const oddsAnalysis = [
    {
      range: "Under 1.5",
      homeWins: "72%",
      draws: "18%",
      awayWins: "10%",
      avgOdds: "1.35"
    },
    {
      range: "1.5 - 2.5",
      homeWins: "48%",
      draws: "26%",
      awayWins: "26%",
      avgOdds: "2.10"
    },
    {
      range: "2.5+",
      homeWins: "25%",
      draws: "28%",
      awayWins: "47%",
      avgOdds: "3.80"
    },
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
            Outcome Distribution Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive breakdown of match outcomes and odds correlation
          </p>
        </div>

        {/* Weekly Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Weekly Outcome Trends
          </h2>
          
          <div className="space-y-4">
            {weeklyBreakdown.map((week, index) => {
              const total = week.homeWins + week.draws + week.awayWins;
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {week.week}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {total} matches
                    </span>
                  </div>
                  <div className="flex h-8 rounded-lg overflow-hidden">
                    <div
                      className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(week.homeWins / total) * 100}%` }}
                    >
                      {week.homeWins}
                    </div>
                    <div
                      className="bg-yellow-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(week.draws / total) * 100}%` }}
                    >
                      {week.draws}
                    </div>
                    <div
                      className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(week.awayWins / total) * 100}%` }}
                    >
                      {week.awayWins}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Odds Range Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Odds Range vs Outcome Distribution
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Odds Range
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Home Wins
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Draws
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Away Wins
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Avg Odds
                  </th>
                </tr>
              </thead>
              <tbody>
                {oddsAnalysis.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {row.range}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                      {row.homeWins}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                      {row.draws}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                      {row.awayWins}
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      {row.avgOdds}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Findings */}
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Key Findings
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• Lower odds (under 1.5) strongly correlate with home wins (72%)</li>
            <li>• Mid-range odds (1.5-2.5) show more balanced outcomes</li>
            <li>• Higher odds (2.5+) favor away wins (47%)</li>
            <li>• Draws are most common in mid-range odds scenarios</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OutcomesPage;
