"use client";

import React from 'react';
import type { Statistics } from '../../../types';

interface BellCurveProps {
  stats: Statistics;
}

const BellCurve: React.FC<BellCurveProps> = ({ stats }) => {
  const total = stats.homeWins + stats.draws + stats.awayWins;
  const homePercent = (stats.homeWins / total) * 100;
  const drawPercent = (stats.draws / total) * 100;
  const awayPercent = (stats.awayWins / total) * 100;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-green-500 font-medium">Home Winss</span>
          <span className="text-foreground font-bold">{stats.homeWins} ({homePercent.toFixed(1)}%)</span>
        </div>
        <div className="h-8 bg-muted rounded-lg overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${homePercent}%` }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-yellow-500 font-medium">Draws</span>
          <span className="text-foreground font-bold">{stats.draws} ({drawPercent.toFixed(1)}%)</span>
        </div>
        <div className="h-8 bg-muted rounded-lg overflow-hidden">
          <div 
            className="h-full bg-yellow-500 transition-all duration-500"
            style={{ width: `${drawPercent}%` }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-blue-500 font-medium">Away Wins</span>
          <span className="text-foreground font-bold">{stats.awayWins} ({awayPercent.toFixed(1)}%)</span>
        </div>
        <div className="h-8 bg-muted rounded-lg overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${awayPercent}%` }}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="text-muted-foreground">Avg Home</div>
            <div className="font-bold text-foreground">{stats.averageHomeOdds.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Avg Draw</div>
            <div className="font-bold text-foreground">{stats.averageDrawOdds.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Avg Away</div>
            <div className="font-bold text-foreground">{stats.averageAwayOdds.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BellCurve;
