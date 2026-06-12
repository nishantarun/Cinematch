import Room from "../models/Room.js";
import generateRoomCode from "../utils/generateRoomCode.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const createRoom = asyncHandler(async (req, res) => {
  let roomCode;
  let existingRoom;

  do {
    roomCode = generateRoomCode();
    existingRoom = await Room.findOne({ roomCode });
  } while (existingRoom);

  const room = await Room.create({
    roomCode,
    host: req.user.userId,
    members: [req.user.userId],
  });

  res.status(201).json({
    success: true,
    room,
  });
});
