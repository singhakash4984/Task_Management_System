import { isUniqueViolation } from "../../../helper/postgresError.js";
import { AppError } from "../../shared/errors/AppError.js";
import {
  FAKE_HASH,
  generateRefreshToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from "../utils/crypto.js";
import { RegisterInput } from "../validation/register.schema.js";
import {
  createUser,
  findByEmail,
  findUserById,
} from "../repositories/user.repository.js";
import {
  createSession,
  revokeAllSessionByUserId,
} from "../repositories/session.repository.js";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env.js";
import { User } from "../types/auth.type.js";
import { meta } from "../types/auth.type.js";
import {
  findSessionByTokenHash,
  revokeSession,
} from "../repositories/session.repository.js";

export const register = async (data: RegisterInput) => {
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
  } catch (error) {
    console.error("Register error: ", error);
    if (isUniqueViolation(error, "users_email_key")) {
      throw new AppError("Email already registered", 409);
    }

    throw new AppError("Internal Server Error", 500);
  }
};

export const login = async (email: string, password: string, meta: meta) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user: User = await findByEmail(normalizedEmail);
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

export const refresh = async (rawToken: string, meta: meta) => {
  const tokenHash = hashToken(rawToken);
  const session = await findSessionByTokenHash(tokenHash);
  if (
    !session ||
    session.revoked_at ||
    new Date(session.expires_at) < new Date()
  ) {
    throw new AppError("Invalid refresh token", 401);
  }
  await revokeSession(session.id);

  const user = await findUserById(session.user_id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const payload = {
    id: user.id,
    role: user.role,
  };

  const newAccesstoken = jwt.sign(payload, env.auth.accessSecret, {
    expiresIn: "15m",
  });

  const newRawToken = generateRefreshToken();

  const newHash = hashToken(newRawToken);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await createSession({
    userId: user.id,
    tokenHash: newHash,
    ip: meta.ip,
    userAgent: meta.userAgent,
    expiresAt,
    rotatedFrom: session.id,
  });

  return {
    accessToken: newAccesstoken,
    refreshToken: newRawToken,
  };
};

export const logout = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);
  const session = await findSessionByTokenHash(tokenHash);
  if (!session) {
    return;
  }
  if (session.revoked_at) {
    await revokeAllSessionByUserId(session.user_id);
  }

  await revokeSession(session.id);
};
