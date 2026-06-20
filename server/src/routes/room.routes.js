import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createRoom, joinRoom, startSession, getSession, submitSwipe, restartSession, leaveRoom, getRoomDetails } from "../controllers/room.controller.js";
import { roomCodeSchema, swipeSchema } from "../validators/room.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createRoom);
router.post("/join", authMiddleware, validate(roomCodeSchema), joinRoom);
router.post("/:roomCode/start", authMiddleware, validate(roomCodeSchema, "params"), startSession);
router.post("/:roomCode/swipe", authMiddleware, validate(roomCodeSchema, "params"), validate(swipeSchema), submitSwipe);
router.post("/:roomCode/restart", authMiddleware, validate(roomCodeSchema, "params"), restartSession);
router.post("/:roomCode/leave", authMiddleware, validate(roomCodeSchema, "params"), leaveRoom);

router.get("/:roomCode/session", authMiddleware, validate(roomCodeSchema, "params"), getSession);
router.get("/:roomCode", authMiddleware, validate(roomCodeSchema, "params"), getRoomDetails);

export default router;
