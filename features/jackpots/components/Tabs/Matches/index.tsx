"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import MatchCard from './MatchCard';
import type { JackpotEvent, LocalPicks, LocalPick } from '../../../types';

interface MatchesTabProps {
  events: JackpotEvent[];
  predictions?: LocalPicks;
  onSelect?: (eventNumber: number, pick: LocalPick) => void;
  hasUnsavedPicks?: boolean;
  onSavePrediction?: () => void;
  isSaving?: boolean;
  jackpotStatus?: string;
}

const MatchesTab: React.FC<MatchesTabProps> = ({
  events,
  predictions = {},
  onSelect,
  hasUnsavedPicks = false,
  onSavePrediction,
  isSaving = false,
  jackpotStatus = 'Open',
}) => {
  const isFinished = jackpotStatus === 'Finished' || jackpotStatus === 'Closed';

  return (
    <div className="p-4 space-y-4">
      {hasUnsavedPicks && !isFinished && (
        <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm p-3 rounded-xl border border-border shadow-lg">
          <button
            onClick={onSavePrediction}
            disabled={isSaving}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Prediction'
            )}
          </button>
        </div>
      )}

      {events.map((event) => (
        <MatchCard
          key={event.eventNumber}
          event={event}
          prediction={predictions[event.eventNumber]}
          onSelect={onSelect}
          isFinished={isFinished}
        />
      ))}
    </div>
  );
};

export default MatchesTab;
