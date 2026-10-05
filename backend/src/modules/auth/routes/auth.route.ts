import { Router } from "express";
import { registerSchema } from "../validation/register.schema.js";
import { validation } from "../../../middleware/validation.middleware.js";
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
} from "../controller/auth.controller.js";
import { loginSchema } from "../validation/login.schema.js";
import { authLimiter } from "../../../middleware/rateLimiter.middleware.js";

const authRouter = Router();

authRouter.post(
  "/register",
  authLimiter,
  validation(registerSchema),
  registerController,
);
authRouter.post(
  "/login",
  authLimiter,
  validation(loginSchema),
  loginController,
);
authRouter.post("/refresh", authLimiter, refreshController);
authRouter.post("/logout", authLimiter, logoutController);

export default authRouter;
