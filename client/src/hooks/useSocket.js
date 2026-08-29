import { useEffect } from "react";
import userAuthStore from "../store/authStore.js";
import socket from "../socket/socket.js";

const useSocket = () => {
  const isAuthenticated = userAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();
    } else if (socket.connected) {
      socket.disconnect();
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated]);
};

export default useSocket;
