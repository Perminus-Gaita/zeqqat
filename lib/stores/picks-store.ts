import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Pick {
  id: string;
  eventNumber: number;
  homeTeam: string;
  awayTeam: string;
  selection: 'Home' | 'Draw' | 'Away';
  odds: number;
  competition: string;
  kickoffTime: string;
}

interface PicksStore {
  picks: Pick[];
  isDrawerOpen: boolean;
  addPick: (pick: Pick) => void;
  removePick: (id: string) => void;
  clearPicks: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const usePicksStore = create<PicksStore>()(
  persist(
    (set) => ({
      picks: [],
      isDrawerOpen: false,
      
      addPick: (pick) =>
        set((state) => {
          // Remove existing pick for this event if any
          const filteredPicks = state.picks.filter(
            (p) => p.eventNumber !== pick.eventNumber
          );
          return { picks: [...filteredPicks, pick] };
        }),
      
      removePick: (id) =>
        set((state) => ({
          picks: state.picks.filter((p) => p.id !== id),
        })),
      
      clearPicks: () => set({ picks: [] }),
      
      toggleDrawer: () =>
        set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      
      openDrawer: () => set({ isDrawerOpen: true }),
      
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: 'picks-storage',
      partialize: (state) => ({ picks: state.picks }),
    }
  )
);
