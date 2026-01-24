import type { TabType } from '../types';

export const TABS: { id: TabType; label: string }[] = [
  { id: 'matches', label: 'Matches' },
  { id: 'predictions', label: 'Predictions' },
  { id: 'stats', label: 'Stats' },
  { id: 'comments', label: 'Comments' },
];

export const MAX_COMMENT_LENGTH = 500;
