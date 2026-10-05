import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
connectDB();
app.listen(env.app.port, () => {
    console.log(`server is running at port ${env.app.port}`);
});
