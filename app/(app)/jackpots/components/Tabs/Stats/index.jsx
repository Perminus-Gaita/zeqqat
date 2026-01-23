"use client";
import React from 'react';
import { TrendingUp, BarChart3, Target, Users, Trophy } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';
import BellCurve from './BellCurve';

const StatsTab = ({ jackpot, communityPredictions }) => {
  const isFinished = jackpot.jackpotStatus === 'Finished';
  
  // Result distribution (only when finished)
  const homeWins = jackpot.events.filter(e => e.resultPick === 'Home').length;
  const draws = jackpot.events.filter(e => e.resultPick === 'Draw').length;
  const awayWins = jackpot.events.filter(e => e.resultPick === 'Away').length;
  
  // Community stats
  const communityStats = { home: 0, draw: 0, away: 0 };
  communityPredictions.forEach(pred => {
    Object.values(pred.picks).forEach(pick => {
      if (pick === 'Home') communityStats.home++;
      else if (pick === 'Draw') communityStats.draw++;
      else communityStats.away++;
    });
  });
  const totalCommunityPicks = communityStats.home + communityStats.draw + communityStats.away;
  
  // Average odds
  const avgOdds = {
    home: (jackpot.events.reduce((sum, e) => sum + (e.odds?.home || 0), 0) / jackpot.events.length).toFixed(2),
    draw: (jackpot.events.reduce((sum, e) => sum + (e.odds?.draw || 0), 0) / jackpot.events.length).toFixed(2),
    away: (jackpot.events.reduce((sum, e) => sum + (e.odds?.away || 0), 0) / jackpot.events.length).toFixed(2)
  };
  
  // Highest odds matches
  const highestOddsMatches = [...jackpot.events]
    .sort((a, b) => {
      const maxA = Math.max(a.odds?.home || 0, a.odds?.draw || 0, a.odds?.away || 0);
      const maxB = Math.max(b.odds?.home || 0, b.odds?.draw || 0, b.odds?.away || 0);
      return maxB - maxA;
    })
    .slice(0, 3);

  return (
    <div className="p-4 space-y-4">
      {/* Probability Distribution - Show when jackpot is NOT finished */}
      {!isFinished && (
        <BellCurve totalGames={jackpot.events.length} />
      )}

      {/* Result Distribution - Only when finished */}
      {isFinished && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Result Distribution</h3>
          </div>
          <div className="flex h-10 rounded-lg overflow-hidden mb-3">
            <div 
              className="bg-green-500 flex items-center justify-center text-sm font-bold text-green-950"
              style={{ width: `${(homeWins / jackpot.events.length) * 100}%` }}
            >
              {homeWins}H
            </div>
            <div 
              className="bg-yellow-500 flex items-center justify-center text-sm font-bold text-yellow-950"
              style={{ width: `${(draws / jackpot.events.length) * 100}%` }}
            >
              {draws}D
            </div>
            <div 
              className="bg-blue-500 flex items-center justify-center text-sm font-bold text-blue-950"
              style={{ width: `${(awayWins / jackpot.events.length) * 100}%` }}
            >
              {awayWins}A
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
            <div>Home Wins: {homeWins}</div>
            <div>Draws: {draws}</div>
            <div>Away Wins: {awayWins}</div>
          </div>
        </div>
      )}

      {/* Prize Breakdown */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Prize Breakdown</h3>
        </div>
        <div className="space-y-3">
          {jackpot.prizes.map((prize) => {
            const isGrand = prize.jackpotType === '17/17';
            return (
              <div 
                key={prize.jackpotType}
                className={`rounded-lg p-3 ${
                  isGrand 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30'
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className={`text-xs font-medium mb-0.5 ${isGrand ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                      {isGrand ? '🏆 GRAND JACKPOT' : `${prize.jackpotType} Correct`}
                    </div>
                    <div className={`text-base font-bold ${isGrand ? 'text-yellow-500' : 'text-foreground'}`}>
                      KSH {formatCurrency(prize.prize)}
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-center ${isGrand ? 'bg-yellow-500/20' : 'bg-background'}`}>
                    <div className={`text-base font-bold ${isGrand ? 'text-yellow-500' : 'text-foreground'}`}>
                      {prize.winners}
                    </div>
                    <div className={`text-[10px] ${isGrand ? 'text-yellow-500/70' : 'text-muted-foreground'}`}>
                      winners
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Picks */}
      {totalCommunityPicks > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Community Picks</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-500">
                {Math.round((communityStats.home / totalCommunityPicks) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Home</div>
            </div>
            <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-500">
                {Math.round((communityStats.draw / totalCommunityPicks) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Draw</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary">
                {Math.round((communityStats.away / totalCommunityPicks) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Away</div>
            </div>
          </div>
        </div>
      )}

      {/* Average Odds */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Average Odds</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-xl font-bold text-foreground">{avgOdds.home}</div>
            <div className="text-xs text-muted-foreground mt-1">Home</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-xl font-bold text-foreground">{avgOdds.draw}</div>
            <div className="text-xs text-muted-foreground mt-1">Draw</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-xl font-bold text-foreground">{avgOdds.away}</div>
            <div className="text-xs text-muted-foreground mt-1">Away</div>
          </div>
        </div>
      </div>

      {/* Highest Odds Matches */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Highest Odds Matches</h3>
        </div>
        <div className="space-y-3">
          {highestOddsMatches.map(match => {
            const maxOdds = Math.max(match.odds?.home || 0, match.odds?.draw || 0, match.odds?.away || 0);
            const maxOddsType = match.odds?.home === maxOdds ? 'Home' : match.odds?.draw === maxOdds ? 'Draw' : 'Away';
            return (
              <div 
                key={match.eventNumber}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-primary/15 text-primary px-2 py-1 rounded text-xs font-semibold">
                    #{match.eventNumber}
                  </span>
                  <span className="text-sm text-foreground truncate">
                    {match.competitorHome} vs {match.competitorAway}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">{maxOdds.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{maxOddsType}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{jackpot.events.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Total Matches</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{communityPredictions.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Predictions</div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;