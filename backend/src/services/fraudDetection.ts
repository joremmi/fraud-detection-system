import { Pool } from 'pg';
import { TransactionData } from '../types';
import { loadModel, predict } from '../ml/model';
import { AlertSystem } from '../websocket';

export class FraudDetectionService {
  private pool: Pool;
  private model: any;
  private alertSystem: AlertSystem;

  constructor(pool: Pool, alertSystem: AlertSystem) {
    this.pool = pool;
    this.model = loadModel();
    this.alertSystem = alertSystem;
  }

  private async checkUserPattern(userId: string, transaction: TransactionData): Promise<string[]> {
    const query = `
      SELECT AVG(amount) as avg_amount, 
             COUNT(*) as tx_count,
             MAX(amount) as max_amount
      FROM fraud_schema.transactions 
      WHERE user_id = $1 
      AND timestamp >= NOW() - INTERVAL '24 hours'
    `;
    
    const result = await this.pool.query(query, [userId]);
    const pattern = result.rows[0];
    
    const risks: string[] = [];
    if (transaction.amount! > pattern.max_amount * 2) {
      risks.push('Unusual transaction amount');
    }
    if (pattern.tx_count > 20) {
      risks.push('High transaction frequency');
    }
    
    return risks;
  }

  private async getLocationRisk(transaction: TransactionData): Promise<string[]> {
    const risks: string[] = [];
    if (!transaction.location) return risks;  // Early return if no location
    
    const query = `
      SELECT location, timestamp 
      FROM fraud_schema.transactions 
      WHERE user_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [transaction.user_id]);
    const lastTransaction = result.rows[0];
    
    if (lastTransaction?.location && transaction.location !== lastTransaction.location) {
      const timeDiff = new Date(transaction.timestamp!).getTime() - 
                      new Date(lastTransaction.timestamp).getTime();
      
      if (timeDiff < 3600000) { // 1 hour
        risks.push('Suspicious location change');
      }
    }
    
    return risks;
  }

  async processTransaction(transaction: TransactionData) {
    const [patternRisks, locationRisks] = await Promise.all([
      this.checkUserPattern(transaction.user_id!, transaction),
      this.getLocationRisk(transaction)
    ]);
    
    const risks = [...patternRisks, ...locationRisks];
    const fraudProbability = await predict(this.model, transaction);
    
    const status = risks.length > 0 || fraudProbability > 0.7 ? 'suspicious' : 'approved';

    if (status === 'suspicious') {
      this.alertSystem.broadcastAlert(transaction, risks);
    }

    const result = await this.pool.query(`
      INSERT INTO fraud_schema.transactions 
      (amount, status, timestamp, description, fraud_probability, risk_factors, location, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      transaction.amount,
      status,
      transaction.timestamp,
      transaction.description,
      fraudProbability,
      JSON.stringify(risks),
      transaction.location,
      transaction.user_id
    ]);

    return result.rows[0];
  }
} 