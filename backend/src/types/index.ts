import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface Transaction {
  id?: string;
  amount: number;
  timestamp: string;
  user_id?: string;
  description?: string;
}

export interface TransactionData extends Transaction {
  status?: 'approved' | 'suspicious' | 'rejected';
  fraud_probability?: number;
  location?: string;  // This is needed for fraud detection
  risk_factors?: string[];
}

export interface ValidationResult {
  valid: boolean;
  risks: string[];
  score?: number;
}

export interface DecodedToken extends JwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
} 