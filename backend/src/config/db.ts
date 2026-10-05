import { Pool } from "pg";
import { env } from "./env.js";


export const pool = new Pool({
  connectionString: env.db.url,
  max: 20,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

export const connectDB = async () => {
  try {
    await pool.query(`SELECT 1`);
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit();
  }
};
