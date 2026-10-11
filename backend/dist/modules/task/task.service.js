import { AppError } from "../../shared/errors/AppError.js";
import { create_task, delete_tasks_by_taskId, get_tasks_by_taskId, get_tasks_by_user } from "./task.repository.js";
export const createTask = async (task) => {
    return await create_task(task);
};
export const gettaskByUserId = async (userId) => {
    return await get_tasks_by_user(userId);
};
export const getTaskByTaskId = async (userId, task_id) => {
    const task = await get_tasks_by_taskId(userId, task_id);
    if (!task) {
        throw new AppError("Task not found", 404);
    }
    return task;
};
export const deleteTaskByTaskId = async (userId, task_id) => {
    const task = await delete_tasks_by_taskId(userId, task_id);
    if (!task) {
        throw new AppError("Task not found", 404);
    }
    return task;
};
