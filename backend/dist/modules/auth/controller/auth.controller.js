import { register, login, logout } from "../service/auth.service.js";
import { env } from "../../../config/env.js";
import { refresh } from "../service/auth.service.js";
export const registerController = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await register(data);
        return res.status(201).json({
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.socket.remoteAddress || "";
        const userAgent = req.headers["user-agent"];
        const tokens = await login(email, password, { ip, userAgent });
        const { accessToken, refreshToken } = tokens;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: env.app.nodeEnv === "production",
            sameSite: "strict",
            path: "/api/v1/auth/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            accessToken
        });
    }
    catch (error) {
        next(error);
    }
};
export const refreshController = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({
                message: "Missing refresh token"
            });
        }
        ;
        const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.socket.remoteAddress || "";
        const userAgent = req.headers["user-agent"];
        const { accessToken, refreshToken } = await refresh(token, {
            ip,
            userAgent
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.app.nodeEnv === "production",
            sameSite: "strict",
            path: "/api/v1/auth/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            accessToken
        });
    }
    catch (error) {
        next(error);
    }
};
export const logoutController = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            await logout(token);
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env.app.nodeEnv === "production",
            sameSite: "strict",
            path: "/api/v1/auth/refresh"
        });
        return res.status(200).json({
            message: "logged out  successfully"
        });
    }
    catch (error) {
        next(error);
    }
};
