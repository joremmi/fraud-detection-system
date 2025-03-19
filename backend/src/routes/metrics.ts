import { Router } from 'express';
import { pool } from '../db';
import { cache } from '../services/cache';

const router = Router();

router.get('/real-time', async (req, res) => {
  try {
    const currentTime = new Date();
    const lastHour = new Date(currentTime.getTime() - 60 * 60 * 1000);

    const query = `
      SELECT 
        date_trunc('minute', timestamp) as time_bucket,
        COUNT(*) as total_transactions,
        COUNT(CASE WHEN status = 'suspicious' THEN 1 END) as suspicious_count,
        AVG(EXTRACT(EPOCH FROM (processed_at - timestamp)) * 1000) as avg_response_time
      FROM fraud_schema.transactions
      WHERE timestamp >= $1
      GROUP BY time_bucket
      ORDER BY time_bucket ASC
    `;

    const result = await pool.query(query, [lastHour]);

    const metrics = {
      fraudRate: result.rows.map(row => ({
        timestamp: row.time_bucket,
        value: (row.suspicious_count / row.total_transactions) * 100
      })),
      responseTime: result.rows.map(row => ({
        timestamp: row.time_bucket,
        value: row.avg_response_time
      })),
      throughput: result.rows.map(row => ({
        timestamp: row.time_bucket,
        value: row.total_transactions
      }))
    };

    // Cache the results
    await cache.set('real-time-metrics', JSON.stringify(metrics), 60);

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching real-time metrics:', error);
    res.status(500).json({ message: 'Error fetching metrics' });
  }
});

export default router;