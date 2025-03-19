// backend/src/routes/auth.ts

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db';

const router = express.Router();

// Signup endpoint
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { name, email, password } = req.body;

      // Check if user exists
      const existingUser = await pool.query(
        'SELECT id FROM fraud_schema.users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const result = await pool.query(
        'INSERT INTO fraud_schema.users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hashedPassword]
      );

      const user = result.rows[0];

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === '23505') {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }
      // Add validation error handling
      if (error.name === 'ValidationError') {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({
        message: 'Server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
      return;
    }
  }
);

// Login endpoint
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const { email, password } = req.body;

      // Find user
      const result = await pool.query(
        'SELECT id, name, email, password_hash FROM fraud_schema.users WHERE email = $1',
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        res.status(400).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Token validation endpoint
router.post('/validate', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    // For now, return a simple validation response
    // TODO: Implement proper JWT validation
    res.json({
      valid: true,
      user: { id: 1, email: 'user@example.com' }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

// Update refresh endpoint
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', {
        ignoreExpiration: true
      }) as { userId: number };

      const user = await pool.query(
        'SELECT id, name, email FROM fraud_schema.users WHERE id = $1',
        [decoded.userId]
      );

      if (!user.rows[0]) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      const newToken = jwt.sign(
        { userId: user.rows[0].id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token: newToken,
        user: {
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
        }
      });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 