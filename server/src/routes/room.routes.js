import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createRoom, joinRoom, startSession, getSession, submitSwipe } from "../controllers/room.controller.js";
import { joinRoomSchema, startSessionSchema, swipeSchema } from "../validators/room.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createRoom);
router.post("/join", authMiddleware, validate(joinRoomSchema), joinRoom);
router.post("/:roomCode/start", authMiddleware, validate(startSessionSchema, "params"), startSession);
router.post("/:roomCode/swipe", authMiddleware,validate(startSessionSchema, "params"), validate(swipeSchema), submitSwipe);

router.get("/:roomCode/session", authMiddleware, validate(startSessionSchema, "params"), getSession);

export default router;
