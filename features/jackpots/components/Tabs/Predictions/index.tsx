"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import PredictionItem from './PredictionItem';
import type { Prediction, Jackpot } from '../../../types';

interface PredictionsTabProps {
  predictions: Prediction[];
  jackpot: Jackpot;
  loading?: boolean;
}

const PredictionsTab: React.FC<PredictionsTabProps> = ({
  predictions,
  jackpot,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-muted-foreground mb-2">No predictions yet</div>
        <div className="text-sm text-muted-foreground">
          Be the first to make a prediction!
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        {predictions.length} {predictions.length === 1 ? 'prediction' : 'predictions'}
      </div>
      
      {predictions.map((prediction) => (
        <PredictionItem
          key={prediction._id}
          prediction={prediction}
          events={jackpot.events}
        />
      ))}
    </div>
  );
};

export default PredictionsTab;
