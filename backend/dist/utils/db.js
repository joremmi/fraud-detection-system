"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: process.env.DB_USER || "default_user",
    password: ((_a = process.env.DB_PASSWORD) === null || _a === void 0 ? void 0 : _a.toString()) || "default_password", // Ensure password is a string
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432, // Ensure port is a number
    database: process.env.DB_NAME || "postgres"
});
exports.default = pool;
