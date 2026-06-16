import { z } from "zod";

export const joinRoomSchema = z.object({
  roomCode: z.string().length(6, "Room code must be 6 characters"),
});

export const startSessionSchema = z.object({
  roomCode: z.string().length(6, "Room code must be 6 characters"),
})

export const swipeSchema = z.object({
  movieId: z.number(),
  liked: z.boolean(),
});