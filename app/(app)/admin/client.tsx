"use client";

import React, { useState } from "react";
import { Plus, Save, Trophy, CheckCircle, Trash2 } from "lucide-react";

interface JackpotEvent {
  eventNumber: number;
  competitorHome: string;
  competitorAway: string;
  competition: string;
  odds: { home: number; draw: number; away: number };
  kickoffTime: string;
  result?: "1" | "X" | "2";
}

interface JackpotGame {
  id: string;
  name: string;
  status: "Open" | "Closed" | "Finished";
  prizePool: number;
  events: JackpotEvent[];
  createdAt: string;
}

export default function AdminClient() {
  const [games, setGames] = useState<JackpotGame[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const [newPrizePool, setNewPrizePool] = useState("");
  const [events, setEvents] = useState<JackpotEvent[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const addEvent = () => {
    const newEvent: JackpotEvent = {
      eventNumber: events.length + 1,
      competitorHome: "",
      competitorAway: "",
      competition: "",
      odds: { home: 0, draw: 0, away: 0 },
      kickoffTime: new Date().toISOString().slice(0, 16),
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (index: number, field: string, value: string | number) => {
    const updated = [...events];
    if (field.startsWith("odds.")) {
      const oddsField = field.split(".")[1] as "home" | "draw" | "away";
      updated[index].odds[oddsField] = Number(value);
    } else {
      (updated[index] as any)[field] = value;
    }
    setEvents(updated);
  };

  const removeEvent = (index: number) => {
    const updated = events.filter((_, i) => i !== index);
    updated.forEach((e, i) => (e.eventNumber = i + 1));
    setEvents(updated);
  };

  const createGame = () => {
    if (!newGameName || events.length === 0) {
      alert("Please add a game name and at least one event");
      return;
    }

    const game: JackpotGame = {
      id: `game_${Date.now()}`,
      name: newGameName,
      status: "Open",
      prizePool: Number(newPrizePool) || 0,
      events: events,
      createdAt: new Date().toISOString(),
    };

    setGames([game, ...games]);
    setNewGameName("");
    setNewPrizePool("");
    setEvents([]);
    setShowCreateForm(false);
    alert("Game created! (Local only - backend coming soon)");
  };

  const setResult = (gameId: string, eventNumber: number, result: "1" | "X" | "2") => {
    setGames(
      games.map((game) => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          events: game.events.map((e) =>
            e.eventNumber === eventNumber ? { ...e, result } : e
          ),
        };
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage jackpot games and results</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Game
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Jackpot Game</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Game Name</label>
              <input
                type="text"
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
                placeholder="e.g. Mega Jackpot GW 25"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prize Pool (KSH)</label>
              <input
                type="number"
                value={newPrizePool}
                onChange={(e) => setNewPrizePool(e.target.value)}
                placeholder="e.g. 250000000"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Events */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Matches ({events.length})</h3>
              <button
                onClick={addEvent}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Add Match
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.map((event, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500">Match {event.eventNumber}</span>
                    <button onClick={() => removeEvent(idx)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Home Team"
                      value={event.competitorHome}
                      onChange={(e) => updateEvent(idx, "competitorHome", e.target.value)}
                      className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Away Team"
                      value={event.competitorAway}
                      onChange={(e) => updateEvent(idx, "competitorAway", e.target.value)}
                      className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Competition"
                      value={event.competition}
                      onChange={(e) => updateEvent(idx, "competition", e.target.value)}
                      className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <input type="number" step="0.1" placeholder="Home odds" value={event.odds.home || ""} onChange={(e) => updateEvent(idx, "odds.home", e.target.value)} className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white" />
                    <input type="number" step="0.1" placeholder="Draw odds" value={event.odds.draw || ""} onChange={(e) => updateEvent(idx, "odds.draw", e.target.value)} className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white" />
                    <input type="number" step="0.1" placeholder="Away odds" value={event.odds.away || ""} onChange={(e) => updateEvent(idx, "odds.away", e.target.value)} className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white" />
                    <input type="datetime-local" value={event.kickoffTime.slice(0, 16)} onChange={(e) => updateEvent(idx, "kickoffTime", e.target.value)} className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={createGame}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Create Game
          </button>
        </div>
      )}

      {/* Existing Games */}
      {games.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No games yet. Create your first jackpot game.</p>
        </div>
      )}

      {games.map((game) => (
        <div key={game.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{game.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {game.events.length} matches &bull; KSH {game.prizePool.toLocaleString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              game.status === "Open"
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}>
              {game.status}
            </span>
          </div>

          {/* Set Results */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Set Results</h4>
            {game.events.map((event) => (
              <div key={event.eventNumber} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-xs text-gray-500 w-6">#{event.eventNumber}</span>
                <span className="text-sm text-gray-900 dark:text-white flex-1">
                  {event.competitorHome} vs {event.competitorAway}
                </span>
                <div className="flex gap-1">
                  {(["1", "X", "2"] as const).map((result) => (
                    <button
                      key={result}
                      onClick={() => setResult(game.id, event.eventNumber, result)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                        event.result === result
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {result}
                    </button>
                  ))}
                </div>
                {event.result && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
