import express from "express";
import apiRouter from "./index.route.js"
import helmet from "helmet";
import { errorHandler } from "./shared/errors/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(helmet())
app.use(express.json({limit:"10kb"}));
app.use(cookieParser())
app.use('/api/v1/auth',apiRouter)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server started ",
  });
});

app.use(errorHandler)

export default app;
