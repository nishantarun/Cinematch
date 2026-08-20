import { create } from "zustand";

const useSessionStore = create((set) => ({
  session: null,

  setSession: (session) => set({ session }),

  clearSession: () => set({ session: null }),
}));

export default useSessionStore;
