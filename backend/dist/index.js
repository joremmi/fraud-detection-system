"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config({ path: './.env' });
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "Loaded" : "Not Loaded");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
const pool = new pg_1.Pool({
    user: process.env.DB_USER || "default_user",
    password: String(process.env.DB_PASSWORD), // Convert password to string explicitly
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432, // Convert port to number
    database: process.env.DB_NAME || "postgres"
});
app.use(async (req, res, next) => {
    try {
        // Check if schema exists
        const schemaExists = await pool.query("SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'fraud_schema'");
        if (schemaExists.rows.length === 0) {
            await pool.query(`
        CREATE SCHEMA fraud_schema;
        
        CREATE TABLE fraud_schema.users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
        }
        next();
    }
    catch (error) {
        console.error('Database initialization error:', error);
        res.status(500).json({ message: 'Server initialization error' });
    }
});
app.use('/api/auth', auth_1.default);
// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
