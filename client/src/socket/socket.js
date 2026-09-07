import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
});

export const joinSocketRoom = (roomCode) => {
  socket.emit("join-room", { roomCode });
};

export const leaveSocketRoom = (roomCode) => {
  socket.emit("leave-room", { roomCode });
};

export default socket;
