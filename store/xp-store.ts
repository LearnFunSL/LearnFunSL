import { create } from "zustand";

interface XpState {
  xp: number;
  setXp: (xp: number) => void;
  addXp: (amount: number) => void;
}

export const useXpStore = create<XpState>((set) => ({
  xp: 0,
  setXp: (xp) => set({ xp }),
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
}));
