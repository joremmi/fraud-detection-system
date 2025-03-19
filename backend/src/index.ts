// backend/src/index.ts

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Pool } from 'pg';
import { AlertSystem } from './websocket';
import authRouter from './routes/auth';
import transactionsRoutes from './routes/transactions';
import reportsRouter from './routes/reports';
import dotenv from 'dotenv';
import { FraudDetectionService } from './services/fraudDetection';
import Redis from 'ioredis';
import dashboardRoutes from './routes/dashboard';
import metricsRoutes from './routes/metrics';
import { setupCors } from './middleware/cors';

dotenv.config();

const app = express();
const server = createServer(app);
const alertSystem = new AlertSystem(server);

// Setup CORS first (before any routes)
setupCors(app);

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount auth routes explicitly at /api/auth path
app.use('/api/auth', authRouter);

// Routes
app.use('/api/transactions', transactionsRoutes);
app.use('/api/reports', reportsRouter);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/metrics', metricsRoutes);

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'fraudguard'
});

// After database connection setup, before any routes
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE SCHEMA IF NOT EXISTS fraud_schema;
      
      CREATE TABLE IF NOT EXISTS fraud_schema.users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS fraud_schema.transactions (
        id SERIAL PRIMARY KEY,
        amount DECIMAL(12,2) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) CHECK (status IN ('approved', 'suspicious', 'rejected')),
        description TEXT,
        processed_at TIMESTAMP WITH TIME ZONE
      );

      -- Insert test user if not exists
      INSERT INTO fraud_schema.users (name, email, password_hash)
      VALUES (
        'Test User',
        'test@example.com',
        '$2a$10$rMt9c1g3FbBqxRWq1Wd.1eZ7QPvKW8tg6SShBzp8HOA47afzjhpwi'
      ) ON CONFLICT (email) DO NOTHING;
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

// Start server only after database is initialized
const startServer = async () => {
  await initializeDatabase();
  
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

// Simulate real-time transactions
setInterval(async () => {
  try {
    const amount = Math.random() * 1000;
    const status = Math.random() > 0.8 ? 'suspicious' : 'approved';
    
    // Get a random user_id from the users table
    const userResult = await pool.query(
      'SELECT id FROM fraud_schema.users ORDER BY RANDOM() LIMIT 1'
    );
    
    const userId = userResult.rows[0]?.id || null;
    
    const result = await pool.query(
      `INSERT INTO fraud_schema.transactions 
        (amount, status, description, user_id, timestamp) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      [amount, status, 'Real-time transaction', userId]
    );

    const transaction = result.rows[0];
    
    // Broadcast new transaction
    const transactionData = {
      ...transaction,
      is_fraudulent: transaction.status === 'suspicious'
    };
    alertSystem.broadcastAlert(transactionData, ['Real-time transaction update']);

    // Update metrics
    const [totalResult, suspiciousResult, amountResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM fraud_schema.transactions'),
      pool.query("SELECT COUNT(*) FROM fraud_schema.transactions WHERE status = 'suspicious'"),
      pool.query('SELECT SUM(amount) FROM fraud_schema.transactions')
    ]);

    const metricsData = {
      id: 'metrics-update-' + Date.now(),
      amount: parseFloat(amountResult.rows[0].sum) || 0,
      timestamp: new Date().toISOString(),
      description: 'Metrics Update'
    };
    alertSystem.broadcastAlert(metricsData, [
      `Total: ${parseInt(totalResult.rows[0].count)}`,
      `Suspicious: ${parseInt(suspiciousResult.rows[0].count)}`
    ]);

  } catch (error) {
    console.error('Error generating real-time transaction:', error);
  }
}, 10000); // Generate new transaction every 10 seconds

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// Handle 404s
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const fraudDetectionService = new FraudDetectionService(pool, alertSystem);

let redisClient: Redis | null = null;
try {
  redisClient = new Redis();
  console.log('Redis connected successfully');
} catch (error: unknown) {
  console.warn('Redis connection failed, continuing without Redis:', (error as Error).message);
  // Application will continue without Redis
}

export { pool };