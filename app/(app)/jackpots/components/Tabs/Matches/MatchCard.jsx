"use client";

import React from "react";
import { countryFlags, teamCountry } from "../../../utils/constants";
import { formatMatchDate } from "../../../utils/helpers";

const MatchCard = ({ event, prediction, onSelect }) => {
  const isFinished = event.resultPick !== null;
  const country = teamCountry[event.competitorHome] || "England";
  const flag = countryFlags[country] || "🏳️";
  const [homeScore, awayScore] = event.score
    ? event.score.split(":")
    : [null, null];

  const getButtonStyle = (pick) => {
    const isSelected = prediction === pick;
    const isResult = event.resultPick === pick;
    let baseClasses =
      "p-3 rounded-lg cursor-pointer flex flex-col items-center gap-1 transition-all border";

    if (isFinished && isResult) {
      return `${baseClasses} bg-green-500/15 border-green-500 text-green-500`;
    } else if (isFinished && isSelected && !isResult) {
      return `${baseClasses} bg-red-500/15 border-red-500 text-red-500`;
    } else if (isSelected && !isFinished) {
      return `${baseClasses} bg-primary/15 border-primary text-primary`;
    }
    return `${baseClasses} bg-muted/50 border-border text-muted-foreground hover:bg-muted`;
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Match Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3 text-sm text-muted-foreground">
        <span className="bg-primary/15 text-primary px-3 py-1 rounded-md font-semibold text-xs">
          {event.eventNumber}
        </span>
        <span className="text-xs">{formatMatchDate(event.kickoffTime)}</span>
        <span className="ml-auto text-xs">
          {flag} {country}
        </span>
      </div>

      {/* Teams */}
      <div className="p-4 flex items-center justify-center gap-3">
        <span className="flex-1 text-right text-sm font-medium text-foreground truncate">
          {event.competitorHome}
        </span>
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-muted-foreground text-sm font-semibold">
          {isFinished ? (
            <>
              <span>{homeScore}</span>
              <span>-</span>
              <span>{awayScore}</span>
            </>
          ) : (
            <span>vs</span>
          )}
        </div>
        <span className="flex-1 text-left text-sm font-medium text-foreground truncate">
          {event.competitorAway}
        </span>
      </div>

      {/* Pick Buttons */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {["Home", "Draw", "Away"].map((pick) => {
          const odds = event.odds?.[pick.toLowerCase()] || "-";
          return (
            <button
              key={pick}
              onClick={() => !isFinished && onSelect?.(event.eventNumber, pick)}
              disabled={isFinished}
              className={getButtonStyle(pick)}
            >
              <span className="text-xs font-medium uppercase opacity-70">
                {pick === "Home" ? "1" : pick === "Draw" ? "X" : "2"}
              </span>
              <span className="text-base font-bold">{odds}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MatchCard;