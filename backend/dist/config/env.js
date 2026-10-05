import { z } from "zod";
import "dotenv/config";
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().min(1024).max(65535).default(3000),
    DATABASE_URL: z
        .string()
        .trim()
        .refine((val) => {
        try {
            const url = new URL(val);
            return ((url.protocol === "postgres:" || url.protocol === "postgresql:") &&
                url.username.length > 0 &&
                url.hostname.length > 0 &&
                url.pathname.length > 1);
        }
        catch (error) {
            return false;
        }
    }),
    JWT_ACCESS_SECRET: z.string().trim().min(32),
    JWT_REFRESH_SECRET: z.string().trim().min(32),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => ({
        field: issue.path.join(".") || "root",
        message: issue.message
    }));
    console.error(JSON.stringify({
        type: "ENV_VALIDATION_ERROR",
        errors
    }));
    process.exit(1);
}
const config = parsed.data;
if (config.NODE_ENV === "production") {
    if (config.DATABASE_URL.includes("localhost")) {
        throw new Error("Production DB cannot be localhost");
    }
}
export const env = Object.freeze({
    app: {
        nodeEnv: config.NODE_ENV,
        port: config.PORT
    },
    db: {
        url: config.DATABASE_URL
    },
    auth: {
        accessSecret: config.JWT_ACCESS_SECRET,
        refreshSecret: config.JWT_REFRESH_SECRET
    },
});
