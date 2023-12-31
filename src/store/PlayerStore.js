import { create } from "zustand";

export const usePlayerStore = create((set) => ({
  isPlaying: false,
  currentMusic: { playlist: null, song: null, songs: [] },
  setCurrentMusic: (currentMusic) => set({ currentMusic }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  volume: 0.33,
  setVolume: (volume) => set({volume})
}));
