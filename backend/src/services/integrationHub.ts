import axios from 'axios';
import { TransactionData as Transaction, ValidationResult } from '../types/index';
import { PaymentService } from './payment';
import { AuditService } from './audit';

export class IntegrationHub {
  private paymentService = new PaymentService();
  private paymentProcessorUrl: string;
  private apiKey: string;

  constructor() {
    this.paymentProcessorUrl = process.env.PAYMENT_PROCESSOR_URL || 'http://localhost:4000';
    this.apiKey = process.env.PAYMENT_PROCESSOR_API_KEY || '';
  }

  async validateWithExternalProviders(transaction: Transaction): Promise<ValidationResult> {
    try {
      const response = await axios.post(
        `${this.paymentProcessorUrl}/validate`,
        transaction,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        valid: response.data.valid,
        risks: response.data.risks || [],
        score: response.data.riskScore
      };
    } catch (error) {
      console.error('External validation error:', error);
      return {
        valid: false,
        risks: ['External validation failed']
      };
    }
  }

  private async checkWithFraudDB(transaction: Transaction) {
    try {
      const response = await axios.post(
        process.env.FRAUDDB_API_URL!,
        {
          amount: transaction.amount,
          userId: transaction.user_id,
          timestamp: transaction.timestamp
        },
        {
          headers: { 'Authorization': `Bearer ${process.env.FRAUDDB_API_KEY}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('FraudDB check failed:', error);
      return { valid: true, risks: [] };
    }
  }

  private async checkWithSanctionsList(transaction: Transaction) {
    // Implementation for sanctions list checking
    return { valid: true, risks: [] };
  }

  async validateExternalTransaction(transactionId: string): Promise<boolean> {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }
    
    try {
      const response = await axios.get(
        `${process.env.EXTERNAL_API_URL}/transactions/${transactionId}`,
        {
          headers: { 'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}` }
        }
      );
      return response.data.valid;
    } catch (error) {
      console.error('External validation error:', error);
      return false;
    }
  }
} 