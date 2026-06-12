import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createRoom } from "../controllers/room.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createRoom);

export default router;
