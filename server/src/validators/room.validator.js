import { z } from "zod";

export const joinRoomSchema = z.object({
  roomCode: z.string().length(6, "Room code must be 6 characters"),
});
