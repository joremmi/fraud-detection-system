import { Request, Response, NextFunction } from 'express';
import { MFAService } from '../services/mfa';
import { pool } from '../db';

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const completeMFASetup = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { secret, qrCode } = await MFAService.generateSecret(userId);
    
    await pool.query(
      'UPDATE fraud_schema.users SET mfa_secret = $1 WHERE id = $2',
      [secret, userId]
    );

    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ message: 'Error setting up MFA' });
  }
};

export const validateMFA = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await pool.query(
      'SELECT mfa_secret FROM fraud_schema.users WHERE id = $1',
      [userId]
    );

    const isValid = MFAService.verifyToken(token, result.rows[0].mfa_secret);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid MFA token' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'MFA validation error' });
  }
}; 