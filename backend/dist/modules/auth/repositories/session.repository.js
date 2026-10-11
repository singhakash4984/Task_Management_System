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
export const findSessionByTokenHash = async (tokenHash) => {
    const result = await pool.query(`
  SELECT * FROM sessions WHERE token_hash = $1 LIMIT 1 
   `, [tokenHash]);
    return result.rows[0];
};
export const revokeSession = async (sessionId) => {
    await pool.query(`
    UPDATE sessions SET revoked_at = NOW() WHERE id = $1
    `, [sessionId]);
};
export const revokeAllSessionByUserId = async (userId) => {
    await pool.query(`
    UPDATE sessions SET revoked_at = NOW() WHERE id = $1 AND revoked_at IS NULL 
    `, [userId]);
};
