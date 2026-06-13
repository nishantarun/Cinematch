import Room from "../models/Room.js";
import generateRoomCode from "../utils/generateRoomCode.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { getMovieDeck } from "../services/tmdb.service.js";

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

export const joinRoom = asyncHandler(async (req, res) => {
  const { roomCode } = req.body;

  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const alreadyJoined = room.members.some(
    (member) => member.toString() === req.user.userId,
  );

  if (alreadyJoined) {
    return res.status(200).json({
      success: true,
      room,
    });
  }

  await Room.findByIdAndUpdate(room._id, {
    $addToSet: {
      members: req.user.userId,
    },
  });

  const updatedRoom = await Room.findById(room._id);
  res.status(200).json({
    success: true,
    room: updatedRoom,
  });
});

export const startSession = asyncHandler(async (req, res) => {
  const {roomCode} = req.params;

  const room = await Room.findOne({roomCode});

  if(!room) {
    throw new ApiError(404, "Room not Found");
  }

  if(room.host.toString() !== req.user.userId) {
    throw new ApiError(403, "Only the host can start the session")
  }

  if(room.currentSession.status === "active"){
    throw new ApiError(400, "Session is already active");
  }

  const movieDeck = await getMovieDeck();

  room.currentSession = {
    status: "active",
    movieDeck,
    startedAt: new Date(),
  }

  await room.save();

  return res.status(200).json({
    success: true,
    message: "Session started",
    movieCount: movieDeck.length,
  })
});
