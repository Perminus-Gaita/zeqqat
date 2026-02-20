import type { Jackpot } from '../types';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE').format(Math.round(amount));
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase();
}

export function getJackpotDateRange(jackpot: Jackpot): { start: Date; end: Date } {
  const start = new Date(jackpot.finished);
  const firstKickoff = jackpot.events.reduce(
    (min, e) => (e.kickoffTime < min ? e.kickoffTime : min),
    jackpot.events[0]?.kickoffTime || jackpot.finished
  );
  return { start, end: new Date(firstKickoff) };
}
