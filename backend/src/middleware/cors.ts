import cors from 'cors';
import { Express } from 'express';

export const setupCors = (app: Express) => {
  app.use(cors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // Add a pre-flight route handler
  app.options('*', cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
}; 