import express from "express";
import authRouter from "./modules/auth/routes/auth.route.js";
import helmet from "helmet";
import { errorHandler } from "./shared/errors/errorHandler.js";
import cookieParser from "cookie-parser";
import userRouter from "./modules/user/routes/user.route.js";
import taskRouter from "./modules/task/task.route.js";
const app = express();
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/tasks', taskRouter);
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "server started ",
    });
});
app.use(errorHandler);
export default app;
