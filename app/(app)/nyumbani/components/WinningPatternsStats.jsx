"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WinningPatternsStats = () => {
  const router = useRouter();
  const [loadingStage, setLoadingStage] = useState(0);
  const [visibleCards, setVisibleCards] = useState([]);

  const patterns = [
    {
      icon: <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      label: "Most wins had a 2+ goal difference",
      percentage: "68%",
      description: "Teams with strong performances dominated",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />,
      label: "Most draws had less than 2 goals",
      percentage: "72%",
      description: "Low-scoring matches often ended level",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      label: "Favourites won",
      percentage: "38%",
      description: "Of the time across all jackpots",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800"
    }
  ];

  useEffect(() => {
    // Stage 1: Show skeleton
    const timer1 = setTimeout(() => setLoadingStage(1), 100);
    
    // Stage 2: Show header
    const timer2 = setTimeout(() => setLoadingStage(2), 600);
    
    // Stage 3-5: Reveal cards one by one
    const timer3 = setTimeout(() => setVisibleCards([0]), 900);
    const timer4 = setTimeout(() => setVisibleCards([0, 1]), 1200);
    const timer5 = setTimeout(() => setVisibleCards([0, 1, 2]), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  if (loadingStage === 0) {
    return null;
  }

  if (loadingStage === 1) {
    return (
      <div className="w-full space-y-4 my-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-32 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 my-6">
      <div className={`flex items-center justify-between transition-all duration-500 ${
        loadingStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Key Winning Patterns
        </h3>
        <button
          onClick={() => router.push('/nyumbani/patterns')}
          className="flex items-center gap-1 text-sm 
                   text-blue-600 hover:text-blue-700 
                   dark:text-blue-400 dark:hover:text-blue-300 
                   transition-colors"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {patterns.map((pattern, index) => (
          <div
            key={index}
            className={`${pattern.bgColor} ${pattern.borderColor} border rounded-lg p-4 
                       transition-all duration-500 hover:shadow-md cursor-pointer
                       ${visibleCards.includes(index) 
                         ? 'opacity-100 translate-y-0' 
                         : 'opacity-0 translate-y-8'}`}
            onClick={() => router.push('/nyumbani/patterns')}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {pattern.icon}
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {pattern.percentage}
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {pattern.label}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {pattern.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinningPatternsStats;
