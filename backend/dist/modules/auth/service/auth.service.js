import { isUniqueViolation } from "../../../helper/postgresError.js";
import { AppError } from "../../shared/errors/AppError.js";
import { FAKE_HASH, generateRefreshToken, hashPassword, hashToken, verifyPassword, } from "../utils/crypto.js";
import { createSession, createUser, findByEmail, } from "../repositories/user.repository.js";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env.js";
export const register = async (data) => {
    const { email, password } = data;
    const normalizedEmail = email.trim().toLowerCase();
    const hashedPassword = await hashPassword(password);
    try {
        const result = await createUser(normalizedEmail, hashedPassword);
        return {
            id: result.id,
            email: result.email,
            role: result.role,
            created_at: result.created_at,
        };
    }
    catch (error) {
        console.error("Register error: ", error);
        if (isUniqueViolation(error, "users_email_key")) {
            throw new AppError("Email already registered", 409);
        }
        throw new AppError("Internal Server Error", 500);
    }
};
export const login = async (email, password, meta) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findByEmail(normalizedEmail);
    const passwordHash = user?.password_hash ?? FAKE_HASH;
    const isMatched = await verifyPassword(passwordHash, password);
    if (!user || !isMatched) {
        throw new AppError("Invalid credentials");
    }
    const payload = {
        id: user.id,
        role: user.role,
    };
    const accessToken = jwt.sign(payload, env.auth.accessSecret, {
        expiresIn: "15m",
    });
    const rawRefreshToken = generateRefreshToken();
    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await createSession({
        userId: user.id,
        tokenHash,
        ip: meta.ip,
        userAgent: meta.userAgent,
        expiresAt,
    });
    return {
        accessToken,
        refreshToken: rawRefreshToken,
    };
};
