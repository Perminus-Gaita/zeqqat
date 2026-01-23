"use client";

import React from "react";
import { Loader2, Users } from "lucide-react";
import PredictionItem from "./PredictionItem";

const PredictionsTab = ({ predictions, jackpot, loading }) => {
  // Loading state
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-muted-foreground text-sm">Loading predictions...</p>
      </div>
    );
  }

  // Empty state
  if (!predictions || predictions.length === 0) {
    return (
      <div className="p-8 text-center">
        <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground text-sm font-medium">
          No predictions yet
        </p>
        <p className="text-muted-foreground/60 text-xs mt-1">
          Be the first to make your picks!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Predictions Count Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {predictions.length}
          </span>{" "}
          prediction{predictions.length !== 1 ? "s" : ""} shared
        </p>
      </div>

      {/* Predictions List */}
      <div>
        {predictions.map((pred) => (
          <PredictionItem
            key={pred._id}
            prediction={pred}
            jackpot={jackpot}
          />
        ))}
      </div>
    </div>
  );
};

export default PredictionsTab;