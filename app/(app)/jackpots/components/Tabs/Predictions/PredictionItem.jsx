"use client";
import React from 'react';
import {formatTimeAgo, generateAvatar} from '../../../utils/helpers';

const PredictionItem = ({prediction, jackpot}) => {
  const isFinished = jackpot.jackpotStatus === 'Finished';

  const calculateScore = () => {
    if (!isFinished) return null;
    let correct = 0;
    jackpot.events.forEach(event => {
      if (prediction.picks[event.eventNumber] === event.resultPick) correct++;
    });
    return correct;
  };

  const score = calculateScore();

  const getScoreBadgeStyle = () => {
    if (score >= 13) return 'bg-green-500 text-white';
    if (score >= 10) return 'bg-yellow-500 text-black';
    return 'bg-muted text-foreground';
  };

  return (
    <div className="p-4 border-b border-border flex gap-3">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{background: generateAvatar(prediction.username)}}
      >
        {prediction.username.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-1 mb-2 flex-wrap">
          <span className="font-semibold text-sm text-foreground">
            {prediction.username}
          </span>
          <span className="text-muted-foreground text-sm">
            @{prediction.username.toLowerCase().replace(/\s/g, '_')}
          </span>
          <span className="text-muted-foreground text-sm">·</span>
          <span className="text-muted-foreground text-sm">
            {formatTimeAgo(prediction.timestamp)}
          </span>
          {score !== null && (
            <span
              className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${getScoreBadgeStyle()}`}
            >
              {score}/17
            </span>
          )}
        </div>

        {/* Picks */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(prediction.picks)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([num, pick]) => {
              const event = jackpot.events[num - 1];
              const isCorrect = isFinished && event?.resultPick === pick;
              const pickLabel = pick === 'Home' ? '1' : pick === 'Draw' ? 'X' : '2';

              return (
                <div
                  key={num}
                  className={`relative px-3 py-2 rounded-lg text-base font-bold border min-w-[44px] text-center ${
                    !isFinished
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : isCorrect
                      ? 'bg-green-500/15 text-green-500 border-green-500/40'
                      : 'bg-red-500/15 text-red-500 border-red-500/40'
                  }`}
                >
                  {/* Small game number in top-left */}
                  <span className="absolute top-0.5 left-1 text-[9px] opacity-60">
                    {num}
                  </span>
                  {/* Pick letter */}
                  {pickLabel}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PredictionItem;