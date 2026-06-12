import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createRoom, joinRoom } from "../controllers/room.controller.js";
import { joinRoomSchema } from "../validators/room.validator.js";
import validate from "../middlewares/validate.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, createRoom);
router.post("/join", authMiddleware, validate(joinRoomSchema), joinRoom);

export default router;
