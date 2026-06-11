import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(30, "Username cannot exceed 10 characters"),

  email: z.email("Invalid email address"),

  password: z.string().min(4, "Password must be atleas 4 characters"),
});
