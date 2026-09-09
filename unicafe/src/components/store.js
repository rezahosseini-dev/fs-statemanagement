import { create } from "zustand";

const useCounterStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    goodClick: () => set((state) => ({ good: state.good + 1 })),
    neutralClick: () => set((state) => ({ neutral: state.neutral + 1 })),
    badClick: () => set((state) => ({ bad: state.bad + 1 })),
    reset: () => set({ good: 0, neutral: 0, bad: 0 }),
  },
}));

export const useCounterValues = () => {
  const good = useCounterStore((state) => state.good);
  const neutral = useCounterStore((state) => state.neutral);
  const bad = useCounterStore((state) => state.bad);

  return { good, neutral, bad };
};

export const useCounterActions = () =>
  useCounterStore((state) => state.actions);
