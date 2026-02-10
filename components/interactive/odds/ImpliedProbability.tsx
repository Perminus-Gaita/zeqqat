"use client";

import { useState } from "react";

export default function ImpliedProbability() {
  const [odds, setOdds] = useState(2.5);
  const [yourProbability, setYourProbability] = useState(50);

  const impliedProb = (1 / odds) * 100;
  const edge = yourProbability - impliedProb;
  const hasValue = edge > 0;

  return (
    <div className="p-5 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
        Value Bet Calculator
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Bookmaker Odds Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bookmaker Odds
          </label>
          <input
            type="range"
            min="1.05"
            max="10"
            step="0.05"
            value={odds}
            onChange={(e) => setOdds(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">1.05</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{odds.toFixed(2)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">10.00</span>
          </div>
        </div>

        {/* Your Estimated Probability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Estimated Probability
          </label>
          <input
            type="range"
            min="1"
            max="99"
            step="1"
            value={yourProbability}
            onChange={(e) => setYourProbability(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">1%</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{yourProbability}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">99%</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Implied Probability</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {impliedProb.toFixed(1)}%
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Estimate</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {yourProbability}%
          </p>
        </div>

        <div
          className={`rounded-lg p-3 text-center ${
            hasValue
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-red-50 dark:bg-red-900/20"
          }`}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Edge</p>
          <p
            className={`text-xl font-bold ${
              hasValue
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {edge > 0 ? "+" : ""}
            {edge.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Verdict */}
      <div
        className={`mt-4 rounded-lg px-4 py-3 text-sm ${
          hasValue
            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
        }`}
      >
        {hasValue ? (
          <span>
            <strong>Value bet.</strong> Your estimated probability ({yourProbability}%)
            is higher than what the odds imply ({impliedProb.toFixed(1)}%).
            The edge is +{edge.toFixed(1)}%.
          </span>
        ) : (
          <span>
            <strong>No value.</strong> The odds imply a {impliedProb.toFixed(1)}%
            chance, but you estimate only {yourProbability}%.
            You would need the bookmaker to offer odds of at least{" "}
            {(100 / yourProbability).toFixed(2)} for this to be a value bet.
          </span>
        )}
      </div>
    </div>
  );
}
