import pino from "pino";
import { env } from "../../../config/env.js";
export const logger = pino({
    level: env.app.nodeEnv === "production" ? "info" : "debug",
    transport: env.app.nodeEnv !== "production" ? {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:standard"
        }
    } : undefined,
    redact: {
        paths: ["req.headers.authorization", "password"], remove: true
    }
});
