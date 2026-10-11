import { createTask, getTaskByTaskId, gettaskByUserId } from "./task.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import { delete_tasks_by_taskId } from "./task.repository.js";
export const createTaskController = async (req, res, next) => {
    try {
        const data = req.body;
        const userId = req.user.id;
        const taskData = {
            userId,
            ...data,
        };
        const result = await createTask(taskData);
        return res.status(201).json({
            message: "task created successfully",
            result
        });
    }
    catch (error) {
        next(error);
    }
};
export const getTaskByUserIdController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await gettaskByUserId(userId);
        return res.status(200).json({
            result
        });
    }
    catch (error) {
        next(error);
    }
};
export const getTaskByTaskIdController = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        if (typeof taskId !== "string" || !taskId) {
            throw new AppError(" task ID is required", 400);
        }
        const result = await getTaskByTaskId(userId, taskId);
        return res.status(200).json({
            result
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteTaskByTaskIdController = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        if (typeof taskId !== "string" || !taskId) {
            throw new AppError(" task ID is required", 400);
        }
        await delete_tasks_by_taskId(userId, taskId);
        return res.status(204).json({});
    }
    catch (error) {
        next(error);
    }
};
