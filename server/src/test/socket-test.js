/**
 * Development utility.
 * Used to manually test Socket.io events.
 * Not used by the application.
 */

import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "../sockets/events.js";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on(SOCKET_EVENTS.MEMBER_JOINED, (data) => {
  console.log("MEMBER_JOINED", data);
});

socket.on(SOCKET_EVENTS.MEMBER_LEFT, (data) => {
  console.log("MEMBER_LEFT", data);
});

socket.on(SOCKET_EVENTS.SESSION_STARTED, (data) => {
  console.log("SESSION_STARTED", data);
});

socket.on(SOCKET_EVENTS.SESSION_RESTARTED, (data) => {
  console.log("SESSION_RESTARTED", data);
});

socket.on(SOCKET_EVENTS.MATCH_FOUND, (data) => {
  console.log("MATCH_FOUND", data);
});

socket.on(SOCKET_EVENTS.SESSION_COMPLETED, (data) => {
  console.log("SESSION_COMPLETED", data);
});
