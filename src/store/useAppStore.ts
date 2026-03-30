import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStore {
  userPath: 'agresor' | 'victima' | 'testigo' | null;
  reputationScore: number;
  allyLevel: number;
  completedModules: string[];
  savedAffirmations: string[];
  selectedCountry: string;
  setUserPath: (path: AppStore['userPath']) => void;
  updateReputation: (delta: number) => void;
  updateAllyLevel: (delta: number) => void;
  completeModule: (moduleId: string) => void;
  saveAffirmation: (text: string) => void;
  setCountry: (country: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      userPath: null,
      reputationScore: 50,
      allyLevel: 0,
      completedModules: [],
      savedAffirmations: [],
      selectedCountry: 'colombia',
      setUserPath: (path) => set({ userPath: path }),
      updateReputation: (delta) =>
        set((s) => ({ reputationScore: Math.max(0, Math.min(100, s.reputationScore + delta)) })),
      updateAllyLevel: (delta) =>
        set((s) => ({ allyLevel: Math.max(0, Math.min(100, s.allyLevel + delta)) })),
      completeModule: (moduleId) =>
        set((s) => ({
          completedModules: s.completedModules.includes(moduleId)
            ? s.completedModules
            : [...s.completedModules, moduleId],
        })),
      saveAffirmation: (text) =>
        set((s) => ({ savedAffirmations: [...s.savedAffirmations, text] })),
      setCountry: (country) => set({ selectedCountry: country }),
      reset: () =>
        set({
          userPath: null,
          reputationScore: 50,
          allyLevel: 0,
          completedModules: [],
          savedAffirmations: [],
        }),
    }),
    { name: 'escudo-store' }
  )
);
