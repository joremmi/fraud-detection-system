import { pool } from '../db';
import { EncryptionService } from './encryption';

export class GDPRService {
  private encryption = new EncryptionService();

  async exportUserData(userId: number) {
    const queries = [
      'SELECT * FROM fraud_schema.users WHERE id = $1',
      'SELECT * FROM fraud_schema.transactions WHERE user_id = $1',
      'SELECT * FROM fraud_schema.audit_logs WHERE user_id = $1'
    ];

    const results = await Promise.all(
      queries.map(query => pool.query(query, [userId]))
    );

    return {
      personalData: results[0].rows[0],
      transactions: results[1].rows,
      auditTrail: results[2].rows
    };
  }

  async deleteUserData(userId: number) {
    await pool.query('BEGIN');
    try {
      // Anonymize transactions
      await pool.query(`
        UPDATE fraud_schema.transactions 
        SET user_id = NULL, 
            description = 'GDPR_REMOVED'
        WHERE user_id = $1
      `, [userId]);

      // Delete personal data
      await pool.query('DELETE FROM fraud_schema.users WHERE id = $1', [userId]);
      
      await pool.query('COMMIT');
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  }
} 