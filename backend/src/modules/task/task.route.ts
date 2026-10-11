import { Router } from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import { authLimiter } from "../../shared/middleware/rateLimiter.middleware.js";
import { createTaskController, deleteTaskByTaskIdController, getTaskByTaskIdController, getTaskByUserIdController } from "./task.controller.js";

const taskRouter = Router();

taskRouter.post("/", authLimiter, authMiddleware,createTaskController);
taskRouter.get("/", authLimiter, authMiddleware,getTaskByUserIdController);
taskRouter.get("/:id", authLimiter, authMiddleware,getTaskByTaskIdController);
taskRouter.delete("/:id", authLimiter, authMiddleware,deleteTaskByTaskIdController);

export default taskRouter;
