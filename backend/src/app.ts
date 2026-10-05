import express from "express";
import authRouter from "./modules/auth/routes/auth.route.js";
import helmet from "helmet";
import { errorHandler } from "./modules/shared/errors/errorHandler.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(helmet())
app.use(express.json({limit:"10kb"}));
app.use(cookieParser())
app.use('/api/v1/auth',authRouter)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server started ",
  });
});

app.use(errorHandler)

export default app;
