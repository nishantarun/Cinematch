import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createRoom, joinRoom, startSession } from "../controllers/room.controller.js";
import { joinRoomSchema } from "../validators/room.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { startSessionSchema } from "../validators/session.validator.js";

const router = express.Router();

router.post("/", authMiddleware, createRoom);
router.post("/join", authMiddleware, validate(joinRoomSchema), joinRoom);
router.post("/:roomCode/start", authMiddleware, validate(startSessionSchema, "params"), startSession);

export default router;
