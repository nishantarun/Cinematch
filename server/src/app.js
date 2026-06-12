import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/room.routes.js";

import errorHandler from "./middlewares/error.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Cinematch API Runnning",
  });
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

app.use(errorHandler);

export default app;
