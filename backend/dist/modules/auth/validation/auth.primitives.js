import { z } from "zod";
import validator from "validator";
export const emailBaseSchema = z
    .string()
    .trim()
    .max(254, "Email too long")
    .refine((val) => validator.isEmail(val), {
    message: "Invalid email",
});
export const passwordStrongSchema = z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(72, "Password too long")
    .refine((val) => val === val.trim(), {
    message: "Password must not start and end with leading and trailing spaces",
});
const INVALID_CREDENTIALS = "Invalid credentials";
export const loginEmailSchema = z.string().min(1, INVALID_CREDENTIALS);
export const loginPasswordSchema = z.string().min(1, INVALID_CREDENTIALS);
