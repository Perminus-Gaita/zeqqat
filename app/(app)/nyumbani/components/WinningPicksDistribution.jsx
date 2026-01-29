"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import BellCurve from './BellCurve';

const WinningPicksDistribution = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = {
    homeWins: 115,
    draws: 58,
    awayWins: 72,
    totalMatches: 245,
    averageHomeOdds: 2.10,
    averageDrawOdds: 3.20,
    averageAwayOdds: 3.40
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[600px]">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 h-48 animate-pulse border border-gray-200 dark:border-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px]">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Winning Picks Statistics</h3>
        </div>
        <BellCurve stats={stats} />
      </div>
    </div>
  );
};

export default WinningPicksDistribution;
