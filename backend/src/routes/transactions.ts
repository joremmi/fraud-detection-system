import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { sanitizeTransactionInput } from '../middleware/sanitize';
import { apiLimiter } from '../middleware/rateLimit';
import { validateTransaction } from '../middleware/validate';
import { FraudDetectionService } from '../services/fraudDetection';
import { IntegrationHub } from '../services/integrationHub';

const router = Router();
const fraudDetectionService = new FraudDetectionService(pool);
const integrationHub = new IntegrationHub();

// Get transactions
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        CAST(amount AS FLOAT) as amount,
        timestamp,
        status,
        description,
        user_id
      FROM fraud_schema.transactions
      ORDER BY timestamp DESC
      LIMIT 100
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Get fraud metrics
router.get('/fraud-metrics', async (_req: Request, res: Response) => {
  try {
    const [totalResult, suspiciousResult, amountResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM fraud_schema.transactions'),
      pool.query("SELECT COUNT(*) FROM fraud_schema.transactions WHERE status = 'suspicious'"),
      pool.query('SELECT SUM(amount) FROM fraud_schema.transactions')
    ]);

    res.json({
      totalTransactions: parseInt(totalResult.rows[0].count),
      suspiciousCount: parseInt(suspiciousResult.rows[0].count),
      totalAmount: parseFloat(amountResult.rows[0].sum || '0')
    });
  } catch (error) {
    console.error('Error fetching fraud metrics:', error);
    res.status(500).json({ message: 'Error fetching fraud metrics' });
  }
});

// Add new transaction
router.post(
  '/transaction',
  [sanitizeTransactionInput, apiLimiter, validateTransaction],
  async (req: Request, res: Response) => {
    try {
      const transaction = req.body;

      // Validate with external providers
      const validationResult = await integrationHub.validateWithExternalProviders(transaction);
      if (!validationResult.valid) {
        return res.status(400).json({
          status: 'rejected',
          reasons: validationResult.risks
        });
      }

      // Process through fraud detection
      const result = await fraudDetectionService.processTransaction(transaction);

      res.json({
        status: result.status,
        transactionId: result.id,
        processedAt: result.timestamp
      });
    } catch (error) {
      console.error('Error processing transaction:', error);
      res.status(500).json({ message: 'Error processing transaction' });
    }
  }
);

export default router; 