import { z } from "zod";
import { emailBaseSchema, passwordStrongSchema } from "./auth.primitives.js";

export const registerSchema = z
  .object({
    email: emailBaseSchema,
    password: passwordStrongSchema,
    confirmPassword: z.string().min(1, "Confirm password required"),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Password do not match",
      });
    }
  });

export type RegisterInput = Readonly<z.infer<typeof registerSchema>>;
