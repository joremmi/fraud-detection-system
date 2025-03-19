import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const transactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional(),
  timestamp: z.string().datetime()
});

export const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
  try {
    transactionSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid transaction data' });
  }
}; 