import { getIO } from "./index.js";

export const emitToRoom = (roomCode, socketEvent, payload) => {
  getIO().to(roomCode).emit(socketEvent, payload);
};
