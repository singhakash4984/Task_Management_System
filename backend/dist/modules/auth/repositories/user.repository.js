import { pool } from "../../../config/db.js";
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
export const createSession = async (data) => {
    const result = await pool.query(`
    INSERT INTO sessions (user_id,token_hash, expires_at, ip,user_agent)
    VALUES ($1, $2, $3, $4, $5)
    `, [data.userId, data.tokenHash, data.expiresAt, data.ip, data.userAgent]);
    return result.rows[0];
};
