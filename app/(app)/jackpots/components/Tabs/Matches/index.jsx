"use client";

import React from "react";
import { Save, Loader2 } from "lucide-react";
import MatchCard from "./MatchCard";

const MatchesTab = ({
  events,
  predictions,
  onSelect,
  hasUnsavedPicks,
  onSavePrediction,
  isSaving,
  jackpotStatus,
}) => {
  const isOpen = jackpotStatus === "Open";
  const picksCount = Object.keys(predictions).length;
  const totalGames = events.length;
  const isComplete = picksCount === totalGames;

  return (
    <div className="relative">
      {/* Matches List */}
      <div className="p-4 space-y-3 pb-24">
        {events.map((event) => (
          <MatchCard
            key={event.eventNumber}
            event={event}
            prediction={predictions[event.eventNumber]}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Floating Save Button */}
      {isOpen && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
          <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
            {/* Progress */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                {picksCount} of {totalGames} picks made
              </span>
              <span
                className={`text-sm font-medium ${
                  isComplete ? "text-green-500" : "text-primary"
                }`}
              >
                {Math.round((picksCount / totalGames) * 100)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isComplete ? "bg-green-500" : "bg-primary"
                }`}
                style={{ width: `${(picksCount / totalGames) * 100}%` }}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={onSavePrediction}
              disabled={!hasUnsavedPicks || isSaving || picksCount === 0}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                hasUnsavedPicks && !isSaving && picksCount > 0
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {hasUnsavedPicks
                    ? "Save Prediction"
                    : picksCount === 0
                    ? "Make your picks to save"
                    : "All picks saved"}
                </>
              )}
            </button>

            {hasUnsavedPicks && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                You have unsaved changes
              </p>
            )}
          </div>
        </div>
      )}

      {/* Closed Jackpot Message */}
      {!isOpen && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
          <div className="bg-muted/50 border border-border rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              This jackpot is closed. You can no longer make predictions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesTab;