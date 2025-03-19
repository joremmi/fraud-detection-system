import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, AuthenticatedRequest } from '../types/index';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as DecodedToken;
    (req as AuthenticatedRequest).user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireMFA = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { mfaToken } = req.body;
  
  if (!mfaToken) {
    return res.status(401).json({ message: 'MFA required' });
  }
  
  // Validate MFA token
  try {
    // Add MFA validation logic
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid MFA token' });
  }
}; 