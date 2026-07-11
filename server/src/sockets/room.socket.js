import { SOCKET_EVENTS } from "./events.js";

export const registerRoomHandlers = (io, socket) => {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomCode }) => {
    socket.join(roomCode);

    console.log(`${socket.id} joined ${roomCode}`);
  });

  socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomCode }) => {
    socket.leave(roomCode);

    console.log(`${socket.id} left ${roomCode}`);
  });
};
