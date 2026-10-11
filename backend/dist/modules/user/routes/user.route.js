import { Router } from "express";
import { authMiddleware } from "../../../shared/middleware/auth.middleware.js";
import { getMeController, deleteMeController } from "../controller/user.controller.js";
const userRouter = Router();
userRouter.get('/me', authMiddleware, getMeController);
userRouter.delete('/me', authMiddleware, deleteMeController);
export default userRouter;
