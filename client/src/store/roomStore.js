import { create } from "zustand";

const useRoomStore = create((set) => ({
  room: null,

  setRoom: (room) => set({ room }),

  clearRoom: () => set({ room: null }),
}));

export default useRoomStore;
