// REMOVE this line. It's the source of the crash.
// import "dotenv/config";

import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

// This console.log is not necessary for production
// console.log("DB URL exists:", process.env.DATABASE_URL!);

// This top-level await is also problematic for the middleware.
// We will fix this by separating the auth config.
export const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = drizzle(connection);
