import { pool } from "../../config/db.js";
import { taskInput } from "../../shared/types/task.type.js";

export const create_task = async (task: taskInput) => {
  const result = await pool.query(
    `
        INSERT INTO tasks 
        (
        user_id,
        title,
        description,
        status,
        priority,
        deadline_at,
        estimated_minutes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
    [
      task.userId,
      task.title,
      task.description,
      task.status,
      task.priority,
      task.deadlineAt,
      task.estimatedMinutes,
    ],
  );
  return result.rows[0]
};


export const get_tasks_by_user = async(userId: string) =>{
const result = await pool.query(`
        SELECT * 
        FROM tasks
        WHERE user_id= $1
        ORDER BY created_at DESC
        `,[userId]) ;

        return result.rows ;
}

export const get_tasks_by_taskId = async(userId: string, taskId:string) =>{
const result = await pool.query(`
        SELECT * 
        FROM tasks
        WHERE user_id= $1 AND id= $2
        LIMIT 1
        `,[userId, taskId]) ;

        return result.rows[0] ?? null;
}
export const delete_tasks_by_taskId = async(userId: string, taskId:string) =>{
const result = await pool.query(`
        DELETE FROM 
       tasks
        WHERE user_id= $1 AND id= $2
        
        `,[userId, taskId]) ;

        return result.rows[0] ?? null;
}
