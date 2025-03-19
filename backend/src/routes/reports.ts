import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { format, subDays } from 'date-fns';

const router = Router();

interface TransactionRow {
  date: Date;
  count: string;
  amount: string;
}

interface MetricsRow {
  fraud_ratio: number;
  total_amount: string;
  avg_transaction_size: string;
}

interface Transaction {
  id: number;
  amount: number;
  status: string;
  timestamp: Date;
  description: string | null;
}

router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');

    // Get daily transactions
    const dailyTransactionsQuery = `
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count,
        SUM(amount) as amount
      FROM fraud_schema.transactions
      WHERE timestamp >= $1
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;

    // Get fraud ratio and other metrics
    const metricsQuery = `
      SELECT 
        COUNT(CASE WHEN status = 'suspicious' THEN 1 END)::float / COUNT(*)::float as fraud_ratio,
        SUM(amount) as total_amount,
        AVG(amount) as avg_transaction_size
      FROM fraud_schema.transactions
      WHERE timestamp >= $1
    `;

    const [dailyResults, metricsResults] = await Promise.all([
      pool.query<TransactionRow>(dailyTransactionsQuery, [startDate]),
      pool.query<MetricsRow>(metricsQuery, [startDate])
    ]);

    res.json({
      dailyTransactions: dailyResults.rows.map(row => ({
        date: format(new Date(row.date), 'MMM dd'),
        count: parseInt(row.count),
        amount: parseFloat(row.amount)
      })),
      fraudRatio: metricsResults.rows[0].fraud_ratio,
      totalAmount: parseFloat(metricsResults.rows[0].total_amount),
      averageTransactionSize: parseFloat(metricsResults.rows[0].avg_transaction_size)
    });

  } catch (error) {
    console.error('Error fetching report metrics:', error);
    res.status(500).json({ message: 'Error fetching report metrics' });
  }
});

router.get('/download', async (req: Request, res: Response) => {
  try {
    const downloadFormat = req.query.format as string;
    const transactions = await pool.query<Transaction>(`
      SELECT 
        id,
        amount,
        status,
        timestamp,
        description
      FROM fraud_schema.transactions
      ORDER BY timestamp DESC
    `);

    if (downloadFormat === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
      
      const csv = [
        'ID,Amount,Status,Timestamp,Description',
        ...transactions.rows.map((t: Transaction) => 
          `${t.id},${t.amount},${t.status},${t.timestamp},${t.description || ''}`
        )
      ].join('\n');
      
      res.send(csv);
    } else {
      // For PDF, you'd need to implement PDF generation
      res.status(400).json({ message: 'PDF format not yet supported' });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
});

export default router; 