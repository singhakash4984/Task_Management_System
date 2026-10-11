import rateLimit from "express-rate-limit";
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({
            status: "fail",
            message: "Too many requests, try again later"
        });
    }
});
