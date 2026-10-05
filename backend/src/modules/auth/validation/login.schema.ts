import { z } from "zod";
import { loginEmailSchema, loginPasswordSchema } from "./auth.primitives.js";
export const loginSchema = z
  .object({
    email: loginEmailSchema,
    password: loginPasswordSchema,
  })
  .strict();

export type loginDTO = z.infer<typeof loginSchema>;
