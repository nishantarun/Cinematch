import { create } from "zustand";

const getInitialTheme = () => {
  return localStorage.getItem("theme") || "light";
};

const useThemeStore = create((set) => ({
  theme: getInitialTheme(),

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));

export default useThemeStore;
