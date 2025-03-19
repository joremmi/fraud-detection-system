import { Request, Response, NextFunction } from 'express';

export const sanitizeTransactionInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.amount) {
    // Ensure amount is a valid number and positive
    req.body.amount = Math.abs(parseFloat(req.body.amount));
    if (isNaN(req.body.amount)) {
      return res.status(400).json({ message: 'Invalid amount format' });
    }
  }
  next();
}; 