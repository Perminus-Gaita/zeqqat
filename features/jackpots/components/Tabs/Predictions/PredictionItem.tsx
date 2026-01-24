"use client";

import React from 'react';
import { Trophy } from 'lucide-react';
import type { Prediction, JackpotEvent } from '../../../types';

interface PredictionItemProps {
  prediction: Prediction;
  events: JackpotEvent[];
}

const PredictionItem: React.FC<PredictionItemProps> = ({ prediction, events }) => {
  const calculateScore = () => {
    if (!prediction.picks) return 0;
    
    let correct = 0;
    prediction.picks.forEach((pick) => {
      const event = events.find(e => e.eventNumber === pick.gameNumber);
      if (event?.result === pick.pick) {
        correct++;
      }
    });
    return correct;
  };

  const score = prediction.score ?? calculateScore();
  const totalMatches = events.length;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {prediction.username?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">
              {prediction.username || 'Anonymous'}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(prediction.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-primary">
            <Trophy className="w-4 h-4" />
            <span className="text-lg font-bold">{score}/{totalMatches}</span>
          </div>
          <div className="text-xs text-muted-foreground">Correct</div>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {prediction.picks.map((pick) => {
          const event = events.find(e => e.eventNumber === pick.gameNumber);
          const isCorrect = event?.result === pick.pick;
          const hasResult = !!event?.result;

          return (
            <div
              key={pick.gameNumber}
              className={`text-center p-2 rounded-lg ${
                hasResult
                  ? isCorrect
                    ? 'bg-green-500/20 border border-green-500/30 text-green-500'
                    : 'bg-red-500/20 border border-red-500/30 text-red-500'
                  : 'bg-muted/50 border border-border text-muted-foreground'
              }`}
            >
              <div className="text-xs opacity-70">#{pick.gameNumber}</div>
              <div className="text-sm font-bold">{pick.pick}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PredictionItem;
