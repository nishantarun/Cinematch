import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(30, "Username cannot exceed 30 characters"),

  email: z.email("Invalid email address"),

  password: z.string().min(4, "Password must be atleas 4 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(4, "Password must be atleast 4 characters"),
});
