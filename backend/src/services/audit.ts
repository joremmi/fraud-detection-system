import { Request } from 'express';
import { pool } from '../db';

export interface AuditLog {
  timestamp: Date;
  userId: string;
  action: string;
  details: object;
}

export class AuditService {
  static async log(
    action: string,
    userId: number,
    resourceType: string,
    resourceId: string,
    details: object,
    request: Request
  ) {
    const query = `
      INSERT INTO fraud_schema.audit_logs 
      (action, user_id, resource_type, resource_id, details, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await pool.query(query, [
      action,
      userId,
      resourceType,
      resourceId,
      JSON.stringify(details),
      request.ip
    ]);
  }

  static async getAuditTrail(resourceId: string) {
    const query = `
      SELECT * FROM fraud_schema.audit_logs
      WHERE resource_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [resourceId]);
    return result.rows;
  }
}