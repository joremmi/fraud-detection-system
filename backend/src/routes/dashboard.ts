import { Router } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/metrics', async (req, res) => {
  try {
    // Get recent transactions and metrics for the last 24 hours
    const [transactionsResult, metricsResult] = await Promise.all([
      pool.query(`
        SELECT 
          id,
          amount,
          status,
          timestamp,
          description
        FROM fraud_schema.transactions
        WHERE timestamp >= NOW() - INTERVAL '24 hours'
        ORDER BY timestamp DESC
        LIMIT 10
      `),
      pool.query(`
        SELECT 
          COUNT(*) as total_transactions,
          COUNT(CASE WHEN status = 'suspicious' THEN 1 END) as suspicious_count,
          SUM(amount) as total_amount
        FROM fraud_schema.transactions
        WHERE timestamp >= NOW() - INTERVAL '24 hours'
      `)
    ]);

    res.json({
      totalTransactions: parseInt(metricsResult.rows[0].total_transactions) || 0,
      suspiciousCount: parseInt(metricsResult.rows[0].suspicious_count) || 0,
      totalAmount: parseFloat(metricsResult.rows[0].total_amount) || 0,
      recentTransactions: transactionsResult.rows.map(tx => ({
        id: tx.id,
        amount: parseFloat(tx.amount),
        timestamp: tx.timestamp,
        status: tx.status,
        description: tx.description
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ message: 'Error fetching dashboard metrics' });
  }
});

export default router;