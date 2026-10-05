import { pool } from "../../../config/db.js";
export const createSession = async (data) => {
    const result = await pool.query(`
    INSERT INTO sessions (user_id, token_hash, ip, user_agent, expires_at )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
    `, [
        data.userId,
        data.tokenHash,
        data.ip,
        data.userAgent ?? null,
        data.expiresAt,
    ]);
    return result.rows[0];
};
