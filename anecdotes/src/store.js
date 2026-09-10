import { create } from "zustand";
import {
  getAll,
  createNew,
  updateVote,
  deleteAnecdote,
} from "./services/anecdotes";

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",
  actions: {
    initializeAnecdotes: async () => {
      const anecdotes = await getAll();
      set({ anecdotes });
    },
    vote: async (id) => {
      set((state) => {
        const anecdoteToChange = state.anecdotes.find((a) => a.id === id);
        if (!anecdoteToChange) return state;

        const updated = {
          ...anecdoteToChange,
          votes: anecdoteToChange.votes + 1,
        };
        return {
          anecdotes: state.anecdotes.map((anecdote) =>
            anecdote.id === id ? updated : anecdote,
          ),
        };
      });

      const currentAnecdote = get().anecdotes.find((a) => a.id === id);
      if (currentAnecdote) {
        await updateVote(currentAnecdote);
      }
    },
    removeAnecdote: async (anecdote) => {
      if (anecdote.votes !== 0) return;

      await deleteAnecdote(anecdote.id);

      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== anecdote.id),
      }));
    },
    setFilter: (filterText) => set({ filter: filterText }),
    createAnecdote: async (content) => {
      const newAnecdote = await createNew(content);
      set((state) => ({
        anecdotes: [...state.anecdotes, newAnecdote],
      }));
    },
  },
}));

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes);
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
export const useFilter = () => useAnecdoteStore((state) => state.filter);
export default useAnecdoteStore;
