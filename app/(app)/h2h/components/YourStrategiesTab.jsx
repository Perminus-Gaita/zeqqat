'use client';

import React from 'react';
import { Zap, Clock, TrendingUp, ChevronRight, Plus } from 'lucide-react';

// ═══════════════════════════════════════════
// DUMMY STRATEGIES
// ═══════════════════════════════════════════
const DUMMY_STRATEGIES = [
  {
    id: 1,
    name: 'Safe Home Favorites',
    description: 'Focus on low-odds home teams with good form',
    rules: 3,
    accuracy: 78.5,
    lastUsed: '2 days ago',
    runs: 24,
  },
  {
    id: 2,
    name: 'Draw Hunter',
    description: 'Target matches likely to end in draws',
    rules: 4,
    accuracy: 65.2,
    lastUsed: '5 days ago',
    runs: 12,
  },
  {
    id: 3,
    name: 'Away Upset Spotter',
    description: 'Find value in away wins with strong momentum',
    rules: 5,
    accuracy: 58.9,
    lastUsed: '1 week ago',
    runs: 8,
  },
];

const YourStrategiesTab = () => {
  return (
    <div className="space-y-3">
      {/* Create new button */}
      <button className="w-full py-3 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground text-xs font-bold flex items-center justify-center gap-2 hover:border-primary/30 hover:text-primary/70 transition-colors">
        <Plus className="w-3.5 h-3.5" />
        Create New Strategy
      </button>

      {/* Strategy cards */}
      {DUMMY_STRATEGIES.map((strategy) => (
        <div
          key={strategy.id}
          className="bg-blue-500/[0.03] rounded-xl border border-border p-4 hover:bg-blue-500/[0.05] transition-colors cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="text-sm font-bold text-foreground">{strategy.name}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">{strategy.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors mt-0.5" />
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-muted-foreground/50" />
              <span className="text-[10px] text-muted-foreground">{strategy.rules} rules</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground/50" />
              <span className="text-[10px] text-muted-foreground">{strategy.accuracy}% accuracy</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground/50" />
              <span className="text-[10px] text-muted-foreground">{strategy.lastUsed}</span>
            </div>
          </div>

          {/* Quick action */}
          <button
            className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-blue-600/10 to-violet-600/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 flex items-center justify-center gap-1.5 hover:from-blue-600/20 hover:to-violet-600/20 transition-all"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <Zap className="w-3 h-3" />
            Run Against This Match
          </button>
        </div>
      ))}
    </div>
  );
};

export default YourStrategiesTab;
