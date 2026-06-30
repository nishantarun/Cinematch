console.log("Starting socket test...");

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected");
  console.log(socket.id);
});

socket.on("connect_error", (err) => {
  console.log("❌ Connection Error:");
  console.log(err.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
