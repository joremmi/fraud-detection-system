import { Router, Response } from 'express';
import { pool } from '../db';
import { validateMFA } from '../middleware/mfa';
import { AuthenticatedRequest } from '../types/index';

const router = Router();

router.get('/risk-analysis', validateMFA, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const query = `
      WITH hourly_metrics AS (
        SELECT 
          DATE_TRUNC('hour', timestamp) as period,
          COUNT(*) as total_count,
          COUNT(CASE WHEN status = 'suspicious' THEN 1 END) as suspicious_count,
          AVG(fraud_probability) as avg_risk_score,
          jsonb_agg(DISTINCT risk_factors) FILTER (WHERE risk_factors IS NOT NULL) as risk_factors
        FROM fraud_schema.transactions
        WHERE timestamp >= NOW() - INTERVAL '24 hours'
        GROUP BY period
      )
      SELECT 
        period,
        total_count,
        suspicious_count,
        avg_risk_score,
        risk_factors,
        suspicious_count::float / NULLIF(total_count, 0) as fraud_ratio
      FROM hourly_metrics
      ORDER BY period DESC
    `;

    const result = await pool.query(query);
    
    res.json({
      hourlyMetrics: result.rows,
      summary: {
        totalTransactions: result.rows.reduce((sum, row) => sum + row.total_count, 0),
        avgFraudRatio: result.rows.reduce((sum, row) => sum + (row.fraud_ratio || 0), 0) / result.rows.length,
        commonRisks: result.rows.flatMap(row => row.risk_factors).filter(Boolean)
      }
    });
  } catch (error) {
    console.error('Error analyzing risks:', error);
    res.status(500).json({ message: 'Error analyzing risks' });
  }
});

export default router; 