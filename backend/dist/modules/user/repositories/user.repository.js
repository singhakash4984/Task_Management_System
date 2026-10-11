import { pool } from "../../../config/db.js";
// import { session } from "../../../shared/types/auth.type.js";
export const createUser = async (email, passwordHash) => {
    const user = await pool.query(`INSERT INTO users (email, password_hash) 
            VALUES($1, $2)
            RETURNING   id, email, created_at, role
        `, [email, passwordHash]);
    return user.rows[0];
};
export const findByEmail = async (email) => {
    const result = await pool.query(`SELECT 
    id, email, password_hash,role
    FROM users 
    WHERE email = $1`, [email]);
    return result.rows[0] ?? null;
};
export const findUserById = async (id) => {
    const result = await pool.query(`SELECT 
    id, email,role,is_active
    FROM users 
    WHERE id = $1 LIMIT 1`, [id]);
    return result.rows[0] ?? null;
};
export const deleteUserById = async (userId) => {
    const result = await pool.query(`
  DELETE FROM users WHERE id= $1
  RETURNING id
  `, [userId]);
    return result.rows[0] ?? null;
};
