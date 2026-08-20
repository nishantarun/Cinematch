import { create } from "zustand";
import { getToken, removeToken, setToken } from "../utils/storage.js";
import { getUserIdFromToken } from "../utils/jwt.js";

const token = getToken();
const userId = getUserIdFromToken(token);

const userAuthStore = create((set) => ({
  token,
  userId,
  isAuthenticated: Boolean(getToken()),

  login: (token) => {
    setToken(token);

    set({
      token,
      userId: getUserIdFromToken(token),
      isAuthenticated: true,
    });
  },

  logout: () => {
    removeToken();

    set({
      token: null,
      userId: null,
      isAuthenticated: false,
    });
  },
}));

export default userAuthStore;
