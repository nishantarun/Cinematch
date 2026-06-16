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
  const { roomCode } = req.params;

  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new ApiError(404, "Room not Found");
  }

  if (room.host.toString() !== req.user.userId) {
    throw new ApiError(403, "Only the host can start the session");
  }

  if (room.currentSession.status === "active") {
    throw new ApiError(400, "Session is already active");
  }

  const movieDeck = await getMovieDeck();

  room.currentSession = {
    status: "active",
    movieDeck,
    startedAt: new Date(),
  };

  await room.save();

  return res.status(200).json({
    success: true,
    message: "Session started",
    movieCount: movieDeck.length,
  });
});

export const getSession = asyncHandler(async (req, res) => {
  const { roomCode } = req.params;

  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const isMember = room.members.some(
    (member) => member.toString() === req.user.userId,
  );

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this room");
  }

  return res.status(200).json({
    success: true,
    session: room.currentSession,
  });
});

export const submitSwipe = asyncHandler(async (req, res) => {
  const { roomCode } = req.params;

  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const isMember = room.members.some(
    (member) => member.toString() === req.user.userId,
  );

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this room");
  }

  if (room.currentSession.status !== "active") {
    throw new ApiError(400, "No active session");
  }

  const { movieId, liked } = req.body;

  const movieExists = room.currentSession.movieDeck.some(
    (movie) => movie.movieId === movieId,
  );

  if (!movieExists) {
    throw new ApiError(400, "Movie does not exist in current session");
  }

  const alreadySwiped = room.currentSession.swipes.some(
    (swipe) =>
      swipe.userId.toString() === req.user.userId && swipe.movieId === movieId,
  );

  if (alreadySwiped) {
    throw new ApiError(400, "You have already swiped this movie");
  }

  room.currentSession.swipes.push({
    userId: req.user.userId,
    movieId,
    liked,
  });

  await room.save();

  const movieSwipes = room.currentSession.swipes.filter(
    (swipe) => swipe.movieId === movieId,
  );

  const everyoneVoted = movieSwipes.length === room.members.length;
  console.log("Everyone voted:", everyoneVoted);

  if (!everyoneVoted) {
    return res.status(200).json({
      sucess: true,
      message: "Swipe recorded",
    });
  }

  const matchFound = movieSwipes.every((swipe) => swipe.liked);
  console.log("Match found:", matchFound);

  if (!matchFound) {
    return res.status(200).json({
      success: true,
      message: "Swipe recorded",
    });
  }

  const alreadyMatched = room.currentSession.matches.some(
    (movie) => movie.movieId === movieId,
  );

  if (!alreadyMatched) {
    const matchedMovie = room.currentSession.movieDeck.find(
      (movie) => movie.movieId === movieId,
    );

    room.currentSession.matches.push(matchedMovie);
  }

  await room.save();

  return res.json({
    success: true,
    message: "Swipe recorded",
  });
});
