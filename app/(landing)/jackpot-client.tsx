"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import JackpotDetails from "@/features/jackpots/components/JackpotDetails";
import TabsHeader from "@/features/jackpots/components/TabsHeader";
import MatchesTab from "@/features/jackpots/components/Tabs/Matches";
import PredictionsTab from "@/features/jackpots/components/Tabs/Predictions";
import CommentsTab from "@/features/jackpots/components/Tabs/Comments";
import { usePicksStore } from "@/lib/stores/picks-store";
import type {
  Jackpot,
  Prediction,
  Comment,
  Statistics,
  TabType,
  LocalPick,
} from "@/features/jackpots/types";

// ============================================
// DUMMY DATA
// ============================================
const DUMMY_JACKPOT: Jackpot = {
  _id: "jp001",
  jackpotHumanId: "12345",
  site: "SportPesa",
  totalPrizePool: 250000000,
  currencySign: "KSH",
  jackpotStatus: "Open",
  isLatest: true,
  finished: new Date("2026-01-25T10:00:00Z").toISOString(),
  bettingClosesAt: new Date("2026-01-26T10:00:00Z").toISOString(),
  finishedGames: 0,
  events: [
    { eventNumber: 1, competitorHome: "Arsenal", competitorAway: "Chelsea", odds: { home: 2.1, draw: 3.2, away: 3.8 }, kickoffTime: new Date("2026-01-25T15:00:00Z").toISOString(), competition: "Premier League" },
    { eventNumber: 2, competitorHome: "Manchester United", competitorAway: "Liverpool", odds: { home: 2.5, draw: 3.1, away: 2.9 }, kickoffTime: new Date("2026-01-25T17:00:00Z").toISOString(), competition: "Premier League" },
    { eventNumber: 3, competitorHome: "Barcelona", competitorAway: "Real Madrid", odds: { home: 2.3, draw: 3.0, away: 3.2 }, kickoffTime: new Date("2026-01-25T19:00:00Z").toISOString(), competition: "La Liga" },
    { eventNumber: 4, competitorHome: "Bayern Munich", competitorAway: "Dortmund", odds: { home: 1.8, draw: 3.5, away: 4.5 }, kickoffTime: new Date("2026-01-25T19:00:00Z").toISOString(), competition: "Bundesliga" },
    { eventNumber: 5, competitorHome: "PSG", competitorAway: "Marseille", odds: { home: 1.6, draw: 3.8, away: 5.0 }, kickoffTime: new Date("2026-01-25T20:00:00Z").toISOString(), competition: "Ligue 1" },
    { eventNumber: 6, competitorHome: "AC Milan", competitorAway: "Inter Milan", odds: { home: 2.4, draw: 3.1, away: 3.0 }, kickoffTime: new Date("2026-01-25T20:00:00Z").toISOString(), competition: "Serie A" },
    { eventNumber: 7, competitorHome: "Tottenham", competitorAway: "West Ham", odds: { home: 1.9, draw: 3.4, away: 4.0 }, kickoffTime: new Date("2026-01-26T15:00:00Z").toISOString(), competition: "Premier League" },
    { eventNumber: 8, competitorHome: "Juventus", competitorAway: "Roma", odds: { home: 2.0, draw: 3.2, away: 3.8 }, kickoffTime: new Date("2026-01-26T17:00:00Z").toISOString(), competition: "Serie A" },
    { eventNumber: 9, competitorHome: "Atletico Madrid", competitorAway: "Sevilla", odds: { home: 1.7, draw: 3.6, away: 4.8 }, kickoffTime: new Date("2026-01-26T19:00:00Z").toISOString(), competition: "La Liga" },
    { eventNumber: 10, competitorHome: "Newcastle", competitorAway: "Aston Villa", odds: { home: 2.2, draw: 3.3, away: 3.4 }, kickoffTime: new Date("2026-01-26T19:00:00Z").toISOString(), competition: "Premier League" },
    { eventNumber: 11, competitorHome: "Benfica", competitorAway: "Porto", odds: { home: 2.0, draw: 3.2, away: 3.6 }, kickoffTime: new Date("2026-01-26T20:00:00Z").toISOString(), competition: "Primeira Liga" },
    { eventNumber: 12, competitorHome: "Ajax", competitorAway: "PSV", odds: { home: 2.3, draw: 3.1, away: 3.2 }, kickoffTime: new Date("2026-01-26T20:00:00Z").toISOString(), competition: "Eredivisie" },
    { eventNumber: 13, competitorHome: "Celtic", competitorAway: "Rangers", odds: { home: 2.1, draw: 3.3, away: 3.5 }, kickoffTime: new Date("2026-01-26T16:00:00Z").toISOString(), competition: "Scottish Premiership" },
  ],
  prizes: [
    { jackpotType: "17/17", prize: 250000000, winners: 0 },
    { jackpotType: "16/17", prize: 5000000, winners: 3 },
    { jackpotType: "15/17", prize: 500000, winners: 45 },
    { jackpotType: "14/17", prize: 50000, winners: 312 },
    { jackpotType: "13/17", prize: 5000, winners: 1245 },
  ],
};

const DUMMY_PREDICTIONS: Prediction[] = [
  { _id: "pred001", jackpotId: "jp001", userId: "user001", username: "KenyanBetPro", picks: [{ gameNumber: 1, pick: "1" }, { gameNumber: 2, pick: "X" }, { gameNumber: 3, pick: "1" }], score: 2, createdAt: new Date("2026-01-24T10:00:00Z").toISOString(), updatedAt: new Date("2026-01-24T10:00:00Z").toISOString() },
  { _id: "pred002", jackpotId: "jp001", userId: "user002", username: "LuckyPunter254", picks: [{ gameNumber: 1, pick: "2" }, { gameNumber: 2, pick: "1" }, { gameNumber: 3, pick: "X" }], score: 1, createdAt: new Date("2026-01-24T12:00:00Z").toISOString(), updatedAt: new Date("2026-01-24T12:00:00Z").toISOString() },
];

const DUMMY_COMMENTS: Comment[] = [
  { _id: "com001", jackpotId: "jp001", userId: "user001", username: "KenyanBetPro", text: "Arsenal looking strong at home. Expecting a win!", createdAt: new Date("2026-01-24T10:00:00Z").toISOString(), updatedAt: new Date("2026-01-24T10:00:00Z").toISOString() },
];

// ============================================
// SKELETON & ERROR
// ============================================
const JackpotSkeleton = () => (
  <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded w-2/3" />
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-32 bg-muted rounded" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded" />
        ))}
      </div>
    </div>
  </div>
);

const JackpotError = ({ error, onRetry }: { error: string | null; onRetry: () => void }) => (
  <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-lg font-semibold text-foreground mb-2">Failed to load jackpot</h2>
      <p className="text-sm text-muted-foreground mb-4">{error || "Something went wrong."}</p>
      <button onClick={onRetry} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function JackpotTracker() {
  const [activeTab, setActiveTab] = useState<TabType>("matches");
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [jackpot] = useState<Jackpot>(DUMMY_JACKPOT);
  const [predictions] = useState<Prediction[]>(DUMMY_PREDICTIONS);
  const [comments, setComments] = useState<Comment[]>(DUMMY_COMMENTS);

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      _id: `com_${Date.now()}`,
      jackpotId: jackpot._id,
      userId: "currentUser",
      username: "You",
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setComments([newComment, ...comments]);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c._id !== commentId));
  };

  if (loading) return <JackpotSkeleton />;
  if (error || !jackpot) return <JackpotError error={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
      <JackpotDetails jackpot={jackpot} />

      <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="animate-in fade-in duration-200">
        {activeTab === "matches" && (
          <MatchesTab events={jackpot.events} jackpotId={jackpot._id} jackpotStatus={jackpot.jackpotStatus} />
        )}
        {activeTab === "predictions" && (
          <PredictionsTab predictions={predictions} jackpot={jackpot} loading={false} />
        )}
        {activeTab === "comments" && (
          <CommentsTab comments={comments} loading={false} submitting={false} onAddComment={handleAddComment} onDeleteComment={handleDeleteComment} currentUserId="currentUser" />
        )}
      </div>
    </div>
  );
}
