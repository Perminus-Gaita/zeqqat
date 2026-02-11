"use client";

import { useState } from "react";

const MEGA_BONUSES = [
  { correct: 17, prize: "JACKPOT (100%)", color: "text-green-600 dark:text-green-400" },
  { correct: 16, prize: "KSH 500,000", color: "text-violet-600 dark:text-blue-400" },
  { correct: 15, prize: "KSH 100,000", color: "text-violet-600 dark:text-blue-400" },
  { correct: 14, prize: "KSH 20,000", color: "text-gray-700 dark:text-gray-300" },
  { correct: 13, prize: "KSH 5,000", color: "text-gray-700 dark:text-gray-300" },
  { correct: 12, prize: "KSH 500", color: "text-gray-500 dark:text-gray-400" },
];

const MIDWEEK_BONUSES = [
  { correct: 13, prize: "JACKPOT (100%)", color: "text-green-600 dark:text-green-400" },
  { correct: 12, prize: "KSH 100,000", color: "text-violet-600 dark:text-blue-400" },
  { correct: 11, prize: "KSH 20,000", color: "text-violet-600 dark:text-blue-400" },
  { correct: 10, prize: "KSH 2,000", color: "text-gray-700 dark:text-gray-300" },
  { correct: 9, prize: "KSH 200", color: "text-gray-500 dark:text-gray-400" },
];

export default function JackpotBonusCalculator() {
  const [jackpotType, setJackpotType] = useState<"mega" | "midweek">("mega");
  const [correctPicks, setCorrectPicks] = useState(13);
  const bonuses = jackpotType === "mega" ? MEGA_BONUSES : MIDWEEK_BONUSES;
  const maxGames = jackpotType === "mega" ? 17 : 13;
  const currentBonus = bonuses.find((b) => b.correct === correctPicks);

  return (
    <div className="p-5 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Jackpot Bonus Tiers</h3>

      <div className="flex gap-2 mb-4">
        {(["mega", "midweek"] as const).map((type) => (
          <button key={type}
            onClick={() => { setJackpotType(type); setCorrectPicks(type === "mega" ? 13 : 10); }}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              jackpotType === type ? "bg-slate-700 text-white dark:bg-blue-600" : "bg-[#d5d7f4] text-gray-700 dark:bg-white/10 dark:text-gray-300"
            }`}
          >{type === "mega" ? "Mega (17 games)" : "Midweek (13 games)"}</button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Your Correct Picks: {correctPicks}/{maxGames}</label>
        <input type="range" min={jackpotType === "mega" ? 12 : 9} max={maxGames} step="1" value={correctPicks}
          onChange={(e) => setCorrectPicks(parseInt(e.target.value))}
          className="w-full accent-slate-700 dark:accent-blue-400" style={{ background: "rgba(0,0,0,0.08)" }} />
      </div>

      {currentBonus && (
        <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none px-4 py-3 mb-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">You win</p>
          <p className={`text-2xl font-bold ${currentBonus.color}`}>{currentBonus.prize}</p>
        </div>
      )}

      <div className="space-y-1">
        {bonuses.map((tier) => (
          <div key={tier.correct}
            className={`flex justify-between px-3 py-2 rounded text-sm ${
              tier.correct === correctPicks ? "bg-white shadow-sm dark:bg-white/10 dark:shadow-none font-semibold" : ""
            }`}
          >
            <span className="text-gray-700 dark:text-gray-300">{tier.correct}/{maxGames} correct</span>
            <span className={tier.color}>{tier.prize}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
