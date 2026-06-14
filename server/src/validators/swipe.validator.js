import { z } from "zod";

export const swipeSchema = z.object({
  movieId: z.number(),
  liked: z.boolean(),
});
