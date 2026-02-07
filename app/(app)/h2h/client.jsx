"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, Cloud, Flame, Play, RotateCcw, Zap,
  BarChart4, TrendingUp, AlertTriangle, Target, History,
  ChevronRight, Loader2
} from 'lucide-react';

const MATCH = {
  meta: {
    league: "Premier League", round: "Round 24",
    date: "Sat, Feb 7 - 20:00", venue: "Emirates Stadium",
    isDerby: true, weather: "Rainy (8°C)",
    referee: "Michael Oliver", refAvgCards: 3.8
  },
  home: {
    name: "Arsenal", short: "ARS",
    color: "bg-red-600", textColor: "text-red-500", accentBg: "bg-red-500/10",
    rank: 3,
    leagueSnippet: [
      { pos: 2, team: "Man City", mp: 8, w: 7, d: 1, l: 0, gf: 22, ga: 6, gd: "+16", pts: 22, last5: ['W','D','W','W','W'] },
      { pos: 3, team: "Arsenal", mp: 8, w: 6, d: 1, l: 1, gf: 20, ga: 8, gd: "+12", pts: 19, last5: ['W','D','W','L','W'], isCurrent: true },
      { pos: 4, team: "Newcastle", mp: 8, w: 5, d: 2, l: 1, gf: 16, ga: 9, gd: "+7", pts: 17, last5: ['W','W','D','W','L'] },
    ],
    quality: { xG: 1.72, actualGoals: 1.55, xGA: 1.10, actualConceded: 1.05, possession: 55, convRate: 12.4, shotsOnTarget: 5.8 },
    form: {
      last5: ['W', 'D', 'W', 'L', 'W'],
      detail: [
        { result: 'W', opponent: 'Wolves', oppRank: 14, score: '3-1' },
        { result: 'D', opponent: 'Man City', oppRank: 1, score: '1-1' },
        { result: 'W', opponent: 'Brentford', oppRank: 11, score: '2-0' },
        { result: 'L', opponent: 'Newcastle', oppRank: 4, score: '0-1' },
        { result: 'W', opponent: 'Burnley', oppRank: 19, score: '4-0' },
      ],
      winPct: 60, goalsScored: 10, goalsConceded: 3, unbeaten: 2
    },
    absences: [{ name: "Rice", reason: "Suspended", role: "CDM", starts: "22/23", avgRating: 7.8, gc: 5 }],
    schedule: { last: { opp: "Wolves", daysAgo: 4 }, next: { opp: "Man Utd", daysIn: 5 } },
    travelKm: 0,
    tactical: { setPieceXG: 0.45, discipline: 1.2, totalYC: 28, totalRC: 1, pressureIndex: 72, counterRate: 18, cleanSheetPct: 42 }
  },
  away: {
    name: "Liverpool", short: "LIV",
    color: "bg-teal-600", textColor: "text-teal-500", accentBg: "bg-teal-500/10",
    rank: 2,
    leagueSnippet: [
      { pos: 1, team: "Arsenal", mp: 8, w: 8, d: 0, l: 0, gf: 23, ga: 4, gd: "+19", pts: 24, last5: ['W','W','W','W','W'] },
      { pos: 2, team: "Liverpool", mp: 8, w: 6, d: 1, l: 1, gf: 20, ga: 8, gd: "+12", pts: 19, last5: ['W','W','D','W','D'], isCurrent: true },
      { pos: 3, team: "Man City", mp: 8, w: 7, d: 1, l: 0, gf: 22, ga: 6, gd: "+16", pts: 22, last5: ['W','D','W','W','W'] },
    ],
    quality: { xG: 1.75, actualGoals: 1.90, xGA: 1.05, actualConceded: 0.95, possession: 52, convRate: 14.1, shotsOnTarget: 6.2 },
    form: {
      last5: ['W', 'W', 'D', 'W', 'D'],
      detail: [
        { result: 'W', opponent: 'Chelsea', oppRank: 5, score: '2-0' },
        { result: 'W', opponent: 'Bournemouth', oppRank: 8, score: '3-1' },
        { result: 'D', opponent: 'Man City', oppRank: 1, score: '2-2' },
        { result: 'W', opponent: 'Everton', oppRank: 16, score: '3-0' },
        { result: 'D', opponent: 'Tottenham', oppRank: 6, score: '1-1' },
      ],
      winPct: 60, goalsScored: 11, goalsConceded: 4, unbeaten: 8
    },
    absences: [],
    schedule: { last: { opp: "Chelsea", daysAgo: 4 }, next: { opp: "Wolves", daysIn: 4 } },
    travelKm: 340,
    tactical: { setPieceXG: 0.22, discipline: 1.8, totalYC: 42, totalRC: 2, pressureIndex: 68, counterRate: 24, cleanSheetPct: 50 }
  },
  h2h: {
    totalMeetings: 192, homeWins: 80, draws: 54, awayWins: 58,
    avgGoals: 2.7, bttsRate: 62,
    last5: [
      { homeGoals: 2, awayGoals: 0, date: 'Oct 8, 2024', venue: 'Emirates' },
      { homeGoals: 1, awayGoals: 1, date: 'Apr 14, 2024', venue: 'Anfield' },
      { homeGoals: 0, awayGoals: 2, date: 'Jan 7, 2024', venue: 'Emirates' },
      { homeGoals: 1, awayGoals: 1, date: 'Sep 23, 2023', venue: 'Anfield' },
      { homeGoals: 3, awayGoals: 1, date: 'Apr 1, 2023', venue: 'Emirates' },
    ]
  }
};

// ── Strategy metrics definition ──
// Each metric: what the strategy evaluates, and what it concludes
const STRATEGY_METRICS = [
  { id: 'rank', section: 'Quality', label: 'League Rank', homeVal: 3, awayVal: 2, verdict: 'A', reason: 'LIV ranked higher (#2 vs #3)', weight: 5 },
  { id: 'xg', section: 'Quality', label: 'xG per game', homeVal: 1.72, awayVal: 1.75, verdict: 'A', reason: 'LIV edge in expected goals', weight: 8 },
  { id: 'xga', section: 'Quality', label: 'xGA per game', homeVal: 1.10, awayVal: 1.05, verdict: 'A', reason: 'LIV concede fewer expected goals', weight: 7 },
  { id: 'conv', section: 'Quality', label: 'Conversion Rate', homeVal: '12.4%', awayVal: '14.1%', verdict: 'A', reason: 'LIV convert chances better', weight: 6 },
  { id: 'poss', section: 'Quality', label: 'Possession', homeVal: '55%', awayVal: '52%', verdict: 'H', reason: 'ARS control the ball more', weight: 4 },
  { id: 'sot', section: 'Quality', label: 'Shots on Target', homeVal: 5.8, awayVal: 6.2, verdict: 'A', reason: 'LIV create more shots on target', weight: 5 },
  { id: 'form', section: 'Form', label: 'Last 5 Results', homeVal: 'WDWLW', awayVal: 'WWDWD', verdict: 'D', reason: 'Both on similar form runs', weight: 7 },
  { id: 'winpct', section: 'Form', label: 'Win %', homeVal: '60%', awayVal: '60%', verdict: 'D', reason: 'Identical win rates', weight: 5 },
  { id: 'gf', section: 'Form', label: 'Goals Scored (L5)', homeVal: 10, awayVal: 11, verdict: 'A', reason: 'LIV scoring slightly more', weight: 6 },
  { id: 'ga', section: 'Form', label: 'Goals Conceded (L5)', homeVal: 3, awayVal: 4, verdict: 'H', reason: 'ARS tighter defense in recent form', weight: 6 },
  { id: 'unb', section: 'Form', label: 'Unbeaten Run', homeVal: 2, awayVal: 8, verdict: 'A', reason: 'LIV unbeaten in 8, ARS lost recently', weight: 7 },
  { id: 'abs', section: 'Health', label: 'Absences', homeVal: '1 out', awayVal: 'Full', verdict: 'A', reason: 'ARS missing Rice (key CDM)', weight: 8 },
  { id: 'rest', section: 'Health', label: 'Days Rest', homeVal: '4d', awayVal: '4d', verdict: 'D', reason: 'Equal rest between matches', weight: 3 },
  { id: 'travel', section: 'Health', label: 'Travel', homeVal: '0km', awayVal: '340km', verdict: 'H', reason: 'ARS at home, no travel fatigue', weight: 4 },
  { id: 'setpiece', section: 'Tactical', label: 'Set Piece xG', homeVal: 0.45, awayVal: 0.22, verdict: 'H', reason: 'ARS dangerous from set pieces', weight: 7 },
  { id: 'clean', section: 'Tactical', label: 'Clean Sheet %', homeVal: '42%', awayVal: '50%', verdict: 'A', reason: 'LIV keep more clean sheets', weight: 5 },
  { id: 'disc', section: 'Tactical', label: 'Discipline', homeVal: '1.2/g', awayVal: '1.8/g', verdict: 'H', reason: 'ARS more disciplined', weight: 4 },
  { id: 'press', section: 'Tactical', label: 'Press Index', homeVal: 72, awayVal: 68, verdict: 'H', reason: 'ARS press more aggressively', weight: 5 },
  { id: 'h2h', section: 'H2H', label: 'Head-to-Head', homeVal: '42%', awayVal: '30%', verdict: 'H', reason: 'ARS historically dominant', weight: 6 },
  { id: 'h2hform', section: 'H2H', label: 'Recent H2H', homeVal: '2W 2D', awayVal: '1W 2D', verdict: 'H', reason: 'ARS won more recently', weight: 5 },
];


// ── Micro components ──

const FormBadge = ({ result, size = 'md' }) => {
  const c = { W: 'bg-emerald-500', D: 'bg-amber-400', L: 'bg-rose-500' };
  const s = size === 'sm' ? 'w-[18px] h-[18px] text-[7px] rounded-sm' : 'w-6 h-6 text-[10px] rounded';
  return <span className={`${c[result]} ${s} flex items-center justify-center font-bold text-white`}>{result}</span>;
};

const H2HDot = ({ result }) => {
  const c = result === 'H' ? 'bg-emerald-500' : result === 'A' ? 'bg-rose-500' : 'bg-amber-400';
  const label = result === 'H' ? MATCH.home.short : result === 'A' ? MATCH.away.short : 'Draw';
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${c} w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white`}>{result}</div>
      <span className="text-[9px] text-muted-foreground font-medium">{label}</span>
    </div>
  );
};

const CARD_BG = 'bg-blue-500/[0.03]';

const Card = ({ icon: Icon, title, children, noPadBody }) => (
  <div className={`${CARD_BG} rounded-xl border border-border overflow-hidden`}>
    <div className="px-4 py-3 border-b border-border flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</h3>
    </div>
    <div className={noPadBody ? '' : 'px-4 py-2'}>{children}</div>
  </div>
);

const Row = ({ label, homeVal, awayVal, unit = '', better = 'higher', clickable, onClick, strategyState }) => {
  const hN = parseFloat(homeVal); const aN = parseFloat(awayVal);
  const hB = better === 'higher' ? hN > aN : better === 'lower' ? hN < aN : false;
  const aB = better === 'higher' ? aN > hN : better === 'lower' ? aN < hN : false;

  // Strategy scanning state
  const isScanning = strategyState === 'scanning';
  const isComplete = strategyState === 'done';

  return (
    <div
      className={`flex items-center py-2.5 border-b border-border/30 last:border-0 transition-all duration-300
        ${clickable ? 'cursor-pointer hover:bg-white/[0.03] active:bg-white/[0.05]' : ''}
        ${isScanning ? 'bg-blue-500/[0.06] border-blue-500/20' : ''}
        ${isComplete ? 'bg-transparent' : ''}`}
      onClick={clickable ? onClick : undefined}
    >
      <span className={`w-[30%] text-sm font-semibold tabular-nums ${hB ? MATCH.home.textColor : 'text-muted-foreground'}`}>{homeVal}{unit}</span>
      <span className={`w-[40%] text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground ${clickable ? 'underline decoration-dotted underline-offset-2 decoration-muted-foreground/30' : ''}`}>{label}</span>
      <span className={`w-[30%] text-right text-sm font-semibold tabular-nums ${aB ? MATCH.away.textColor : 'text-muted-foreground'}`}>{awayVal}{unit}</span>
    </div>
  );
};

// ── Expandables ──

const LeagueTableExpand = ({ snippet, accentBg }) => (
  <div className="overflow-hidden rounded-lg border border-border/30 my-2">
    <div className="flex items-center px-2 py-1.5 bg-muted/40 text-[8px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/30">
      <span className="flex-1">Club</span>
      <span className="w-6 text-center">MP</span><span className="w-5 text-center">W</span><span className="w-5 text-center">D</span><span className="w-5 text-center">L</span>
      <span className="w-6 text-center">GF</span><span className="w-6 text-center">GA</span><span className="w-7 text-center">GD</span><span className="w-6 text-center">Pts</span>
      <span className="w-[68px] text-center">L5</span>
    </div>
    {snippet.map((r, i) => (
      <div key={i} className={`flex items-center px-2 py-1.5 text-[11px] ${r.isCurrent ? accentBg + ' font-bold text-foreground' : 'text-muted-foreground'} ${i < snippet.length - 1 ? 'border-b border-border/20' : ''}`}>
        <span className="flex-1 flex items-center gap-1 truncate"><span className="text-[10px] w-3 text-muted-foreground">{r.pos}</span><span className="truncate">{r.team}</span></span>
        <span className="w-6 text-center tabular-nums">{r.mp}</span><span className="w-5 text-center tabular-nums">{r.w}</span><span className="w-5 text-center tabular-nums">{r.d}</span><span className="w-5 text-center tabular-nums">{r.l}</span>
        <span className="w-6 text-center tabular-nums">{r.gf}</span><span className="w-6 text-center tabular-nums">{r.ga}</span><span className="w-7 text-center tabular-nums">{r.gd}</span><span className="w-6 text-center tabular-nums font-bold">{r.pts}</span>
        <span className="w-[68px] flex items-center justify-center gap-[2px]">{r.last5.map((f, j) => <FormBadge key={j} result={f} size="sm" />)}</span>
      </div>
    ))}
  </div>
);

const FormDetailExpand = ({ team }) => (
  <div className="my-2 rounded-lg border border-border/30 overflow-hidden">
    <div className="px-3 py-1.5 bg-muted/40 border-b border-border/30 flex items-center justify-between">
      <span className="text-[10px] font-bold text-muted-foreground uppercase">{team.short} Last 5</span>
      <span className="text-[10px] text-muted-foreground">GF {team.form.goalsScored} · GA {team.form.goalsConceded}</span>
    </div>
    {team.form.detail.map((m, i) => (
      <div key={i} className={`flex items-center gap-2 px-3 py-2 text-xs ${i < team.form.detail.length - 1 ? 'border-b border-border/20' : ''}`}>
        <FormBadge result={m.result} />
        <span className="font-semibold text-foreground">{m.score}</span>
        <span className="text-muted-foreground">vs</span>
        <span className="text-foreground flex-1">{m.opponent}</span>
        <span className="text-muted-foreground text-[10px]">#{m.oppRank}</span>
      </div>
    ))}
  </div>
);

const XGBreakdown = () => {
  const hDiff = (MATCH.home.quality.actualGoals - MATCH.home.quality.xG).toFixed(2);
  const aDiff = (MATCH.away.quality.actualGoals - MATCH.away.quality.xG).toFixed(2);
  const hOver = parseFloat(hDiff) >= 0; const aOver = parseFloat(aDiff) >= 0;
  return (
    <div className="my-2 rounded-lg border border-border/30 p-3">
      <div className="flex items-start justify-between text-xs">
        <div>
          <p className={`font-bold ${hOver ? 'text-emerald-400' : 'text-rose-400'}`}>{hOver ? '↑ Over' : '↓ Under'}performing</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{MATCH.home.quality.actualGoals} − {MATCH.home.quality.xG} = <span className={hOver ? 'text-emerald-400' : 'text-rose-400'}>{hDiff}</span></p>
        </div>
        <div className="text-right">
          <p className={`font-bold ${aOver ? 'text-emerald-400' : 'text-rose-400'}`}>{aOver ? '↑ Over' : '↓ Under'}performing</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{MATCH.away.quality.actualGoals} − {MATCH.away.quality.xG} = <span className={aOver ? 'text-emerald-400' : 'text-rose-400'}>{aDiff}</span></p>
        </div>
      </div>
    </div>
  );
};


// ══════════════════════════════════════════════
// STRATEGY VISUALIZATIONS
// ══════════════════════════════════════════════

// ── VARIATION A: "Inline Verdict" ──
// Each metric row gets a slim verdict bar beneath it
// as the strategy scans through. Shows H/D/A verdict
// with reason text that types out.

const StrategyVerdictInline = ({ metric, visible, animating }) => {
  const [typed, setTyped] = useState('');
  const reason = metric.reason;

  useEffect(() => {
    if (!animating) { setTyped(reason); return; }
    setTyped('');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTyped(reason.slice(0, i));
      if (i >= reason.length) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [animating, reason]);

  if (!visible) return null;

  const vColor = metric.verdict === 'H' ? 'text-red-400 bg-red-500/10 border-red-500/20'
    : metric.verdict === 'A' ? 'text-teal-400 bg-teal-500/10 border-teal-500/20'
    : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  const vLabel = metric.verdict === 'H' ? MATCH.home.short : metric.verdict === 'A' ? MATCH.away.short : 'DRAW';

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-md mx-1 mb-1 text-[10px] ${vColor} transition-all duration-300`}>
      <span className="font-black text-[9px] uppercase w-8 shrink-0">{vLabel}</span>
      <span className="flex-1 opacity-80">{typed}<span className={animating && typed.length < reason.length ? 'animate-pulse' : 'hidden'}>▌</span></span>
      <span className="font-bold text-[9px] shrink-0">+{metric.weight}</span>
    </div>
  );
};


// ── VARIATION B: "Running Scoreboard" ──
// A fixed scoreboard at the top that shows H/D/A
// scores accumulating. Each metric adds weight points.

const RunningScoreboard = ({ processedIdx, metrics }) => {
  let hScore = 0, dScore = 0, aScore = 0;
  for (let i = 0; i <= processedIdx && i < metrics.length; i++) {
    const m = metrics[i];
    if (m.verdict === 'H') hScore += m.weight;
    else if (m.verdict === 'D') dScore += m.weight;
    else aScore += m.weight;
  }
  const total = hScore + dScore + aScore || 1;
  const hPct = ((hScore / total) * 100).toFixed(0);
  const dPct = ((dScore / total) * 100).toFixed(0);
  const aPct = ((aScore / total) * 100).toFixed(0);

  return (
    <div className={`${CARD_BG} rounded-xl border border-border p-3 mb-4 transition-all`}>
      {/* Score numbers */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-center flex-1">
          <p className="text-2xl font-black text-red-500 tabular-nums">{hScore}</p>
          <p className="text-[9px] font-bold text-muted-foreground">{MATCH.home.short}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-2xl font-black text-amber-400 tabular-nums">{dScore}</p>
          <p className="text-[9px] font-bold text-muted-foreground">DRAW</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-2xl font-black text-teal-500 tabular-nums">{aScore}</p>
          <p className="text-[9px] font-bold text-muted-foreground">{MATCH.away.short}</p>
        </div>
      </div>
      {/* Percentage bar */}
      <div className="flex rounded-full overflow-hidden h-2 bg-muted/30">
        <div className="bg-red-500 transition-all duration-500" style={{ width: `${hPct}%` }} />
        <div className="bg-amber-400 transition-all duration-500" style={{ width: `${dPct}%` }} />
        <div className="bg-teal-500 transition-all duration-500" style={{ width: `${aPct}%` }} />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[9px] text-muted-foreground">
        <span>{hPct}%</span>
        <span>{processedIdx + 1} / {metrics.length} metrics</span>
        <span>{aPct}%</span>
      </div>
    </div>
  );
};


// ── VARIATION C: "Console Log" ──
// Matrix/terminal-style readout that scrolls
// as each metric is evaluated.

const ConsoleLog = ({ processedIdx, metrics, currentSection }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [processedIdx]);

  return (
    <div className="rounded-xl border border-border overflow-hidden mb-4 bg-black/40">
      <div className="px-3 py-1.5 border-b border-border/50 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-[9px] font-mono text-muted-foreground/60">strategy.run()</span>
      </div>
      <div ref={scrollRef} className="px-3 py-2 max-h-44 overflow-y-auto font-mono text-[10px] leading-relaxed">
        {metrics.slice(0, processedIdx + 1).map((m, i) => {
          const vColor = m.verdict === 'H' ? 'text-red-400' : m.verdict === 'A' ? 'text-teal-400' : 'text-amber-400';
          const vLabel = m.verdict === 'H' ? 'HOME' : m.verdict === 'A' ? 'AWAY' : 'DRAW';
          const isLast = i === processedIdx;
          return (
            <div key={i} className={`${isLast ? 'text-foreground' : 'text-muted-foreground/60'} transition-colors`}>
              <span className="text-blue-400/60">[{m.section}]</span>{' '}
              <span>{m.label}:</span>{' '}
              <span className={vColor}>→ {vLabel}</span>{' '}
              <span className="text-muted-foreground/40">// {m.reason}</span>{' '}
              <span className="text-emerald-500/50">(+{m.weight})</span>
            </div>
          );
        })}
        {processedIdx < metrics.length - 1 && (
          <span className="text-blue-400 animate-pulse">▌</span>
        )}
      </div>
    </div>
  );
};


// ══════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════

const SECTION_TABS = [
  { id: 'stats', label: 'Stats & Data' },
  { id: 'odds', label: 'Odds' },
];

const STRATEGY_STYLES = [
  { id: 'inline', label: 'Inline' },
  { id: 'scoreboard', label: 'Scoreboard' },
  { id: 'console', label: 'Console' },
];

const H2HClient = () => {
  const [ex, setEx] = useState({});
  const [activeSection, setActiveSection] = useState('stats');
  const toggle = (k) => setEx(p => ({ ...p, [k]: !p[k] }));

  // Strategy state
  const [strategyRunning, setStrategyRunning] = useState(false);
  const [strategyDone, setStrategyDone] = useState(false);
  const [currentMetricIdx, setCurrentMetricIdx] = useState(-1);
  const [strategyStyle, setStrategyStyle] = useState('scoreboard');
  const timerRef = useRef(null);

  const runStrategy = useCallback(() => {
    setStrategyRunning(true);
    setStrategyDone(false);
    setCurrentMetricIdx(-1);

    let idx = 0;
    timerRef.current = setInterval(() => {
      setCurrentMetricIdx(idx);
      idx++;
      if (idx >= STRATEGY_METRICS.length) {
        clearInterval(timerRef.current);
        setTimeout(() => {
          setStrategyRunning(false);
          setStrategyDone(true);
        }, 600);
      }
    }, 400);
  }, []);

  const resetStrategy = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStrategyRunning(false);
    setStrategyDone(false);
    setCurrentMetricIdx(-1);
  }, []);

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  // Map metric IDs to the row labels for inline highlighting
  const getMetricRowState = (metricId) => {
    if (!strategyRunning && !strategyDone) return null;
    const metricIdx = STRATEGY_METRICS.findIndex(m => m.id === metricId);
    if (metricIdx < 0) return null;
    if (metricIdx === currentMetricIdx) return 'scanning';
    if (metricIdx < currentMetricIdx) return 'done';
    return null;
  };

  const homeWinPct = ((MATCH.h2h.homeWins / MATCH.h2h.totalMeetings) * 100).toFixed(0);
  const drawPct = ((MATCH.h2h.draws / MATCH.h2h.totalMeetings) * 100).toFixed(0);
  const awayWinPct = ((MATCH.h2h.awayWins / MATCH.h2h.totalMeetings) * 100).toFixed(0);

  // Current section being analyzed
  const currentSection = currentMetricIdx >= 0 ? STRATEGY_METRICS[currentMetricIdx]?.section : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* ── MATCH HEADER ── */}
      <div className={`${CARD_BG} rounded-xl border border-border p-4`}>
        <div className="text-center mb-4">
          <p className="text-xs font-semibold text-muted-foreground">{MATCH.meta.league} · {MATCH.meta.round}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{MATCH.meta.date}</p>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex-1 flex flex-col items-center">
            <div className={`w-14 h-14 rounded-xl ${MATCH.home.color} flex items-center justify-center text-white font-black text-xl mb-1.5`}>{MATCH.home.short[0]}</div>
            <p className="font-bold text-foreground text-sm">{MATCH.home.name}</p>
            <p className="text-[10px] text-muted-foreground">Home</p>
          </div>
          <div className="flex items-center justify-center pt-5">
            <span className="text-xs font-black text-muted-foreground/30 tracking-widest">VS</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className={`w-14 h-14 rounded-xl ${MATCH.away.color} flex items-center justify-center text-white font-black text-xl mb-1.5`}>{MATCH.away.short[0]}</div>
            <p className="font-bold text-foreground text-sm">{MATCH.away.name}</p>
            <p className="text-[10px] text-muted-foreground">Away</p>
          </div>
        </div>
      </div>

      {/* ── RUN STRATEGY BUTTON ── */}
      <div className="my-3">
        {!strategyRunning && !strategyDone && (
          <button
            onClick={runStrategy}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:from-blue-500 hover:to-violet-500 active:scale-[0.99] transition-all shadow-lg shadow-blue-500/20"
          >
            <Zap className="w-4 h-4" />
            Run Strategy
          </button>
        )}
        {strategyRunning && (
          <div className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600/80 to-violet-600/80 text-white font-bold text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing... {currentMetricIdx + 1}/{STRATEGY_METRICS.length}
          </div>
        )}
        {strategyDone && (
          <div className="flex gap-2">
            <div className="flex-1 py-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Strategy Complete
            </div>
            <button
              onClick={resetStrategy}
              className="px-4 py-3 rounded-xl bg-muted border border-border text-muted-foreground font-bold text-sm flex items-center gap-2 hover:bg-muted/80 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Strategy style switcher (only when running or done) */}
        {(strategyRunning || strategyDone) && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[9px] text-muted-foreground/50 mr-1">View:</span>
            {STRATEGY_STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setStrategyStyle(s.id)}
                className={`px-2 py-1 rounded text-[9px] font-bold transition-colors ${
                  strategyStyle === s.id ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── STRATEGY VISUALIZATIONS (above tabs, below button) ── */}
      {(strategyRunning || strategyDone) && strategyStyle === 'scoreboard' && (
        <RunningScoreboard processedIdx={currentMetricIdx} metrics={STRATEGY_METRICS} />
      )}
      {(strategyRunning || strategyDone) && strategyStyle === 'console' && (
        <ConsoleLog processedIdx={currentMetricIdx} metrics={STRATEGY_METRICS} currentSection={currentSection} />
      )}

      {/* ── SECTION TABS ── */}
      <div className="flex border-b border-border mb-4">
        {SECTION_TABS.map(t => (
          <button key={t.id} onClick={() => setActiveSection(t.id)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition-colors relative ${
              activeSection === t.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'}`}>
            {t.label}
            {activeSection === t.id && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />}
          </button>
        ))}
      </div>

      {/* ── STATS & DATA ── */}
      {activeSection === 'stats' && (
        <div className="space-y-4">

          {/* QUALITY & EFFICIENCY */}
          <Card icon={BarChart4} title="Quality & Efficiency">
            <Row label="League Rank" homeVal={MATCH.home.rank} awayVal={MATCH.away.rank} better="lower" clickable onClick={() => toggle('rank')} strategyState={getMetricRowState('rank')} />
            {ex.rank && (
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{MATCH.home.short}</p>
                <LeagueTableExpand snippet={MATCH.home.leagueSnippet} accentBg={MATCH.home.accentBg} />
                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-2">{MATCH.away.short}</p>
                <LeagueTableExpand snippet={MATCH.away.leagueSnippet} accentBg={MATCH.away.accentBg} />
              </div>
            )}
            {/* Inline verdict for rank */}
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[0]} visible={currentMetricIdx >= 0} animating={currentMetricIdx === 0} />}

            <Row label="xG" homeVal={MATCH.home.quality.xG} awayVal={MATCH.away.quality.xG} clickable onClick={() => toggle('xg')} strategyState={getMetricRowState('xg')} />
            {ex.xg && <XGBreakdown />}
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[1]} visible={currentMetricIdx >= 1} animating={currentMetricIdx === 1} />}

            <Row label="xGA" homeVal={MATCH.home.quality.xGA} awayVal={MATCH.away.quality.xGA} better="lower" strategyState={getMetricRowState('xga')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[2]} visible={currentMetricIdx >= 2} animating={currentMetricIdx === 2} />}

            <Row label="Conv. Rate" homeVal={MATCH.home.quality.convRate} awayVal={MATCH.away.quality.convRate} unit="%" strategyState={getMetricRowState('conv')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[3]} visible={currentMetricIdx >= 3} animating={currentMetricIdx === 3} />}

            <Row label="Possession" homeVal={MATCH.home.quality.possession} awayVal={MATCH.away.quality.possession} unit="%" strategyState={getMetricRowState('poss')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[4]} visible={currentMetricIdx >= 4} animating={currentMetricIdx === 4} />}

            <Row label="Shots on Target" homeVal={MATCH.home.quality.shotsOnTarget} awayVal={MATCH.away.quality.shotsOnTarget} strategyState={getMetricRowState('sot')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[5]} visible={currentMetricIdx >= 5} animating={currentMetricIdx === 5} />}
          </Card>

          {/* MOMENTUM & FORM */}
          <Card icon={TrendingUp} title="Momentum & Form">
            <div
              className={`flex items-center justify-between py-3 border-b border-border/30 cursor-pointer hover:bg-white/[0.03] transition-all
                ${getMetricRowState('form') === 'scanning' ? 'bg-blue-500/[0.06]' : ''}`}
              onClick={() => toggle('form')}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground">{MATCH.home.short}</span>
                {MATCH.home.form.last5.map((r, i) => <FormBadge key={i} result={r} />)}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest underline decoration-dotted underline-offset-2 decoration-muted-foreground/30">Last 5</span>
              <div className="flex items-center gap-1.5">
                {MATCH.away.form.last5.map((r, i) => <FormBadge key={i} result={r} />)}
                <span className="text-[10px] font-bold text-muted-foreground">{MATCH.away.short}</span>
              </div>
            </div>
            {ex.form && (
              <div><FormDetailExpand team={MATCH.home} /><FormDetailExpand team={MATCH.away} /></div>
            )}
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[6]} visible={currentMetricIdx >= 6} animating={currentMetricIdx === 6} />}

            <Row label="Win %" homeVal={MATCH.home.form.winPct} awayVal={MATCH.away.form.winPct} unit="%" strategyState={getMetricRowState('winpct')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[7]} visible={currentMetricIdx >= 7} animating={currentMetricIdx === 7} />}

            <Row label="Goals Scored" homeVal={MATCH.home.form.goalsScored} awayVal={MATCH.away.form.goalsScored} strategyState={getMetricRowState('gf')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[8]} visible={currentMetricIdx >= 8} animating={currentMetricIdx === 8} />}

            <Row label="Goals Conceded" homeVal={MATCH.home.form.goalsConceded} awayVal={MATCH.away.form.goalsConceded} better="lower" strategyState={getMetricRowState('ga')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[9]} visible={currentMetricIdx >= 9} animating={currentMetricIdx === 9} />}

            <Row label="Unbeaten Run" homeVal={MATCH.home.form.unbeaten} awayVal={MATCH.away.form.unbeaten} strategyState={getMetricRowState('unb')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[10]} visible={currentMetricIdx >= 10} animating={currentMetricIdx === 10} />}
          </Card>

          {/* SQUAD HEALTH */}
          <Card icon={AlertTriangle} title="Squad Health">
            <div className={`flex items-center py-2.5 border-b border-border/30 cursor-pointer hover:bg-white/[0.03] transition-all
              ${getMetricRowState('abs') === 'scanning' ? 'bg-blue-500/[0.06]' : ''}`}
              onClick={() => toggle('abs')}>
              <span className={`w-[30%] text-sm font-semibold ${MATCH.home.absences.length > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {MATCH.home.absences.length > 0 ? `${MATCH.home.absences.length} out` : 'Full'}
              </span>
              <span className="w-[40%] text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground underline decoration-dotted underline-offset-2 decoration-muted-foreground/30">Absences</span>
              <span className={`w-[30%] text-right text-sm font-semibold ${MATCH.away.absences.length > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {MATCH.away.absences.length > 0 ? `${MATCH.away.absences.length} out` : 'Full'}
              </span>
            </div>
            {ex.abs && (
              <div className="my-2 space-y-2">
                {MATCH.home.absences.map((p, i) => (
                  <div key={i} className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-rose-500">{MATCH.home.short} — {p.name}</span>
                      <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">{p.reason}</span>
                    </div>
                    <div className="flex gap-3 text-[10px] text-muted-foreground">
                      <span>{p.role}</span><span>{p.starts} starts</span><span>Avg {p.avgRating}</span><span>{p.gc} G+A</span>
                    </div>
                  </div>
                ))}
                {MATCH.away.absences.length === 0 && <p className="text-xs text-emerald-500">{MATCH.away.short}: Full squad</p>}
              </div>
            )}
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[11]} visible={currentMetricIdx >= 11} animating={currentMetricIdx === 11} />}

            <Row label="Days Rest" homeVal={MATCH.home.schedule.last.daysAgo} awayVal={MATCH.away.schedule.last.daysAgo} unit="d" strategyState={getMetricRowState('rest')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[12]} visible={currentMetricIdx >= 12} animating={currentMetricIdx === 12} />}

            <Row label="Travel" homeVal={MATCH.home.travelKm} awayVal={MATCH.away.travelKm} unit="km" better="lower" strategyState={getMetricRowState('travel')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[13]} visible={currentMetricIdx >= 13} animating={currentMetricIdx === 13} />}
          </Card>

          {/* TACTICAL */}
          <Card icon={Target} title="Tactical">
            <Row label="Set Piece xG" homeVal={MATCH.home.tactical.setPieceXG} awayVal={MATCH.away.tactical.setPieceXG} strategyState={getMetricRowState('setpiece')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[14]} visible={currentMetricIdx >= 14} animating={currentMetricIdx === 14} />}

            <Row label="Clean Sheet %" homeVal={MATCH.home.tactical.cleanSheetPct} awayVal={MATCH.away.tactical.cleanSheetPct} unit="%" strategyState={getMetricRowState('clean')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[15]} visible={currentMetricIdx >= 15} animating={currentMetricIdx === 15} />}

            <Row label="YC / game" homeVal={MATCH.home.tactical.discipline} awayVal={MATCH.away.tactical.discipline} better="lower" clickable onClick={() => toggle('disc')} strategyState={getMetricRowState('disc')} />
            {ex.disc && (
              <div className="my-2 rounded-lg border border-border/30 p-3 text-xs text-muted-foreground space-y-1">
                <p>{MATCH.home.short}: {MATCH.home.tactical.totalYC} yellows, {MATCH.home.tactical.totalRC} reds (season)</p>
                <p>{MATCH.away.short}: {MATCH.away.tactical.totalYC} yellows, {MATCH.away.tactical.totalRC} reds (season)</p>
                <p className="text-[10px] pt-1 border-t border-border/20">Ref: {MATCH.meta.referee} — avg {MATCH.meta.refAvgCards} cards/game</p>
              </div>
            )}
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[16]} visible={currentMetricIdx >= 16} animating={currentMetricIdx === 16} />}

            <Row label="Press Index" homeVal={MATCH.home.tactical.pressureIndex} awayVal={MATCH.away.tactical.pressureIndex} strategyState={getMetricRowState('press')} />
            {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[17]} visible={currentMetricIdx >= 17} animating={currentMetricIdx === 17} />}

            <Row label="Counter Rate" homeVal={MATCH.home.tactical.counterRate} awayVal={MATCH.away.tactical.counterRate} unit="%" />
          </Card>

          {/* H2H */}
          <Card icon={History} title={`H2H (${MATCH.h2h.totalMeetings} meetings)`} noPadBody>
            <div className="p-4">
              <div className="flex justify-center gap-4 mb-4">
                {MATCH.h2h.last5.map((m, i) => {
                  const r = m.homeGoals > m.awayGoals ? 'H' : m.awayGoals > m.homeGoals ? 'A' : 'D';
                  return <H2HDot key={i} result={r} />;
                })}
              </div>
              <div className="flex rounded-lg overflow-hidden h-9 mb-4">
                <div className={`${MATCH.home.color} flex items-center justify-center text-white text-[11px] font-bold`} style={{ width: `${homeWinPct}%` }}>{MATCH.home.short} {homeWinPct}%</div>
                <div className="bg-muted-foreground/30 flex items-center justify-center text-white text-[11px] font-bold" style={{ width: `${drawPct}%` }}>{drawPct}%</div>
                <div className={`${MATCH.away.color} flex items-center justify-center text-white text-[11px] font-bold`} style={{ width: `${awayWinPct}%` }}>{MATCH.away.short} {awayWinPct}%</div>
              </div>

              {/* Inline strategy verdict for H2H */}
              {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[18]} visible={currentMetricIdx >= 18} animating={currentMetricIdx === 18} />}
              {strategyStyle === 'inline' && <StrategyVerdictInline metric={STRATEGY_METRICS[19]} visible={currentMetricIdx >= 19} animating={currentMetricIdx === 19} />}

              {MATCH.h2h.last5.map((m, i) => {
                const homeWon = m.homeGoals > m.awayGoals;
                const awayWon = m.awayGoals > m.homeGoals;
                return (
                  <div key={i} className="border-b border-border/20 last:border-0 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => toggle(`h_${i}`)}>
                    <div className="flex items-center justify-between px-1 py-3">
                      <span className={`text-xs font-bold w-10 ${homeWon ? MATCH.home.textColor : 'text-muted-foreground'}`}>{MATCH.home.short}</span>
                      <span className="font-black text-foreground text-base tabular-nums">{m.homeGoals} - {m.awayGoals}</span>
                      <span className={`text-xs font-bold w-10 text-right ${awayWon ? MATCH.away.textColor : 'text-muted-foreground'}`}>{MATCH.away.short}</span>
                    </div>
                    {ex[`h_${i}`] && (
                      <div className="text-center pb-2.5"><span className="text-[10px] text-muted-foreground">{m.date} · {m.venue}</span></div>
                    )}
                  </div>
                );
              })}
              <div className="flex justify-between mt-3 pt-3 border-t border-border/30 text-[10px] text-muted-foreground">
                <span>Avg {MATCH.h2h.avgGoals} goals/match</span>
                <span>BTTS {MATCH.h2h.bttsRate}%</span>
                <span>{MATCH.h2h.totalMeetings} meetings</span>
              </div>
            </div>
          </Card>

          {/* Final verdict (shows after strategy completes) */}
          {strategyDone && (
            <div className={`${CARD_BG} rounded-xl border border-emerald-500/30 p-5 text-center`}>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Strategy Verdict</p>
              {(() => {
                let h = 0, d = 0, a = 0;
                STRATEGY_METRICS.forEach(m => { if (m.verdict === 'H') h += m.weight; else if (m.verdict === 'D') d += m.weight; else a += m.weight; });
                const winner = h >= a && h >= d ? 'H' : a >= h && a >= d ? 'A' : 'D';
                const total = h + d + a;
                return (
                  <>
                    <p className="text-xl font-black text-foreground mb-1">
                      {winner === 'H' ? MATCH.home.name + ' Win' : winner === 'A' ? MATCH.away.name + ' Win' : 'Draw'}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Based on {STRATEGY_METRICS.length} weighted metrics
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm font-bold">
                      <span className="text-red-500">{MATCH.home.short} {((h/total)*100).toFixed(0)}%</span>
                      <span className="text-amber-400">Draw {((d/total)*100).toFixed(0)}%</span>
                      <span className="text-teal-500">{MATCH.away.short} {((a/total)*100).toFixed(0)}%</span>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-muted-foreground/50 pb-4">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {MATCH.meta.venue}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Cloud className="w-3 h-3" /> {MATCH.meta.weather}</span>
            <span>·</span>
            <span>Ref: {MATCH.meta.referee}</span>
            {MATCH.meta.isDerby && (<><span>·</span><span className="flex items-center gap-1 text-orange-400/50"><Flame className="w-3 h-3" /> Derby</span></>)}
          </div>
        </div>
      )}

      {activeSection === 'odds' && (
        <div className={`${CARD_BG} rounded-xl border border-border p-8 text-center`}>
          <p className="text-sm text-muted-foreground">Odds comparison coming soon</p>
          <p className="text-[10px] text-muted-foreground/50 mt-1">1X2, Over/Under, BTTS, Asian Handicap</p>
        </div>
      )}
    </div>
  );
};

export default H2HClient;
