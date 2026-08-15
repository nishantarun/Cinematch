import { create } from "zustand";
import { getToken, removeToken, setToken } from "../utils/storage.js";

const token = getToken();

const userAuthStore = create((set) => ({
  token,
  isAuthenticated: Boolean(getToken()),

  login: (token) => {
    setToken(token);

    set({
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    removeToken();

    set({
      token: null,
      isAuthenticated: false,
    });
  },
}));

export default userAuthStore;
