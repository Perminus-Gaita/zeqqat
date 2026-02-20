"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePicksStore } from "@/lib/stores/picks-store";
import type { JackpotEvent, LocalPick } from "@/features/jackpots/types";

interface MatchCardProps {
  event: JackpotEvent;
  jackpotId: string;
  onSelect?: (eventNumber: number, pick: LocalPick) => void;
  isFinished?: boolean;
  isLast?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
  event,
  jackpotId,
  onSelect,
  isFinished = false,
  isLast = false,
}) => {
  const router = useRouter();
  const { picks, addPick, removePickByEvent } = usePicksStore();

  const existingPick = picks.find((p) => p.eventNumber === event.eventNumber);
  const currentSelection = existingPick?.selection || undefined;

  const handlePickSelect = (pick: LocalPick, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFinished) return;

    if (currentSelection === pick) {
      removePickByEvent(event.eventNumber);
      if (onSelect) onSelect(event.eventNumber, pick);
      return;
    }

    const odds =
      pick === "Home" ? event.odds.home :
      pick === "Draw" ? event.odds.draw :
      event.odds.away;

    addPick({
      id: `${event.eventNumber}_${pick}`,
      eventNumber: event.eventNumber,
      homeTeam: event.competitorHome,
      awayTeam: event.competitorAway,
      selection: pick,
      odds: odds,
      competition: event.competition,
      kickoffTime: event.kickoffTime,
    });

    if (onSelect) onSelect(event.eventNumber, pick);
  };

  const pickOptions: LocalPick[] = ["Home", "Draw", "Away"];

  return (
    <div
      className={`px-4 py-4 cursor-pointer hover:bg-muted/30 transition-colors ${
        !isLast ? "border-b border-border" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-semibold text-muted-foreground">
          Match {event.eventNumber}
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
          {event.competition}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-sm font-bold flex-1 text-right">{event.competitorHome}</div>
        <div className="text-xs text-muted-foreground px-2">vs</div>
        <div className="text-sm font-bold flex-1 text-left">{event.competitorAway}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {pickOptions.map((pick) => {
          const odds =
            pick === "Home" ? event.odds.home :
            pick === "Draw" ? event.odds.draw :
            event.odds.away;
          const isSelected = currentSelection === pick;

          return (
            <button
              key={pick}
              onClick={(e) => handlePickSelect(pick, e)}
              disabled={isFinished}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              } ${isFinished ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="block text-xs mb-1">
                {pick === "Home" ? "1" : pick === "Draw" ? "X" : "2"}
              </span>
              <span className="text-base font-bold">{odds.toFixed(2)}</span>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground">
        {new Date(event.kickoffTime).toLocaleString()}
      </div>
    </div>
  );
};

export default MatchCard;
