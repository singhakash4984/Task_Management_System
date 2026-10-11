import { AppError } from "../../shared/errors/AppError.js";
import { taskInput } from "../../shared/types/task.type.js";
import { create_task, delete_tasks_by_taskId, get_tasks_by_taskId, get_tasks_by_user } from "./task.repository.js";

export const createTask = async(task:taskInput) =>{
return await create_task(task) ;
}


export const gettaskByUserId = async(userId: string) =>{
return await get_tasks_by_user(userId) ;
}

export const getTaskByTaskId = async(userId: string, task_id: string) =>{
const task =  await get_tasks_by_taskId(userId,task_id) ;
if(!task){
    throw new AppError("Task not found", 404) ;
}
return task ;
}

export const deleteTaskByTaskId = async(userId: string, task_id: string) =>{
const task =  await delete_tasks_by_taskId(userId,task_id) ;
if(!task){
    throw new AppError("Task not found", 404) ;
}
return task ;
}