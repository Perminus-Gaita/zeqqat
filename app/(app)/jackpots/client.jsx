"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import JackpotDetails from "./components/JackpotDetails";
import TabsHeader from "./components/TabsHeader";
import MatchesTab from "./components/Tabs/Matches";
import PredictionsTab from "./components/Tabs/Predictions";
import StatsTab from "./components/Tabs/Stats";
import CommentsTab from "./components/Tabs/Comments";
import {
  usePredictions,
  useComments,
  useStatistics,
  useJackpotDetails,
} from "./hooks/useJackpotApi";

// Loading skeleton component
const JackpotSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
      {/* Header Skeleton */}
      <div className="p-4 border-b border-border">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="flex gap-4 mt-4">
            <div className="h-16 bg-muted rounded flex-1" />
            <div className="h-16 bg-muted rounded flex-1" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex border-b border-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 py-4 flex justify-center">
            <div className="h-4 bg-muted rounded w-16 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-muted rounded-xl animate-pulse"
          />
        ))}
      </div>
    </div>
  </div>
);

// Error component
const JackpotError = ({ error, onRetry }) => (
  <div className="min-h-screen bg-background">
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Failed to load jackpot
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {error || "Something went wrong. Please try again."}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  </div>
);

export default function JackpotTracker({ jackpotId: propJackpotId }) {
  const [activeTab, setActiveTab] = useState("matches");
  const [localPicks, setLocalPicks] = useState({});

  // You can pass jackpotId as a prop or get it from URL params
  // For now, we'll use a default or the prop
  const jackpotId = propJackpotId || "latest"; // "latest" can be handled by API to return the latest jackpot

  // Fetch jackpot details from API
  const {
    data: jackpot,
    loading: jackpotLoading,
    error: jackpotError,
    refetch: refetchJackpot,
  } = useJackpotDetails(jackpotId);

  // API hooks - only fetch when we have a jackpot
  const {
    predictions,
    userPrediction,
    loading: predictionsLoading,
    submitting: predictionsSubmitting,
    createPrediction,
    updatePrediction,
    deletePrediction,
  } = usePredictions(jackpot?._id);

  const {
    comments,
    loading: commentsLoading,
    submitting: commentsSubmitting,
    createComment,
    deleteComment,
  } = useComments(jackpot?._id);

  const { stats, loading: statsLoading } = useStatistics(jackpot?._id);

  // Convert user prediction picks to the local format for the Matches tab
  const userPicks = useMemo(() => {
    if (!userPrediction?.picks) return localPicks;

    const picksMap = {};
    userPrediction.picks.forEach((pick) => {
      // Convert '1', 'X', '2' to 'Home', 'Draw', 'Away'
      const pickLabel =
        pick.pick === "1" ? "Home" : pick.pick === "X" ? "Draw" : "Away";
      picksMap[pick.gameNumber] = pickLabel;
    });
    return { ...picksMap, ...localPicks };
  }, [userPrediction, localPicks]);

  // Handle local pick selection
  const handlePickSelect = useCallback((eventNumber, pick) => {
    setLocalPicks((prev) => ({
      ...prev,
      [eventNumber]: pick,
    }));
  }, []);

  // Convert local picks to API format and save prediction
  const handleSavePrediction = useCallback(async () => {
    const allPicks = { ...userPicks, ...localPicks };

    // Convert to API format: { gameNumber, pick } where pick is '1', 'X', or '2'
    const picksArray = Object.entries(allPicks).map(([gameNumber, pick]) => ({
      gameNumber: parseInt(gameNumber),
      pick: pick === "Home" ? "1" : pick === "Draw" ? "X" : "2",
    }));

    if (picksArray.length === 0) return;

    if (userPrediction) {
      await updatePrediction(userPrediction._id, picksArray);
    } else {
      await createPrediction(picksArray);
    }

    // Clear local picks after saving
    setLocalPicks({});
  }, [userPicks, localPicks, userPrediction, createPrediction, updatePrediction]);

  // Handle adding a comment
  const handleAddComment = useCallback(
    async (text) => {
      if (!text.trim()) return;
      await createComment(text);
    },
    [createComment]
  );

  // Handle deleting a comment
  const handleDeleteComment = useCallback(
    async (commentId) => {
      await deleteComment(commentId);
    },
    [deleteComment]
  );

  // Check if user has unsaved picks
  const hasUnsavedPicks = Object.keys(localPicks).length > 0;

  // Show loading state while fetching jackpot
  if (jackpotLoading) {
    return <JackpotSkeleton />;
  }

  // Show error state if jackpot failed to load
  if (jackpotError || !jackpot) {
    return <JackpotError error={jackpotError} onRetry={refetchJackpot} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
        {/* Jackpot Details Header */}
        <JackpotDetails jackpot={jackpot} />

        {/* Tabs Navigation */}
        <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="animate-in fade-in duration-200">
          {activeTab === "matches" && (
            <MatchesTab
              events={jackpot.events}
              predictions={userPicks}
              onSelect={handlePickSelect}
              hasUnsavedPicks={hasUnsavedPicks}
              onSavePrediction={handleSavePrediction}
              isSaving={predictionsSubmitting}
              jackpotStatus={jackpot.jackpotStatus}
            />
          )}

          {activeTab === "predictions" && (
            <PredictionsTab
              predictions={predictions}
              jackpot={jackpot}
              loading={predictionsLoading}
            />
          )}

          {activeTab === "stats" && (
            <StatsTab
              jackpot={jackpot}
              communityPredictions={predictions}
              stats={stats}
              loading={statsLoading}
            />
          )}

          {activeTab === "comments" && (
            <CommentsTab
              comments={comments}
              loading={commentsLoading}
              submitting={commentsSubmitting}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          )}
        </div>
      </div>
    </div>
  );
}