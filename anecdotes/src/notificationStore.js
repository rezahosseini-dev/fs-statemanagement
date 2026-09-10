import { create } from "zustand";

let timeoutId = null;

const useNotificationStore = create((set) => ({
  message: null,
  actions: {
    setNotification: (message, timeInSeconds = 5) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      set({ message });

      timeoutId = setTimeout(() => {
        set({ message: null });
      }, timeInSeconds * 1000);
    },
  },
}));

export const useNotification = () =>
  useNotificationStore((state) => state.message);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
