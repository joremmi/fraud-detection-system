import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || "default_user",
  password: process.env.DB_PASSWORD?.toString() || "default_password", // Ensure password is a string
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432, // Ensure port is a number
  database: process.env.DB_NAME || "postgres"
});

export default pool;
