import api from './api';
import { AxiosResponse } from 'axios';

interface TransactionValidationRequest {
  amount: number;
  merchantId: string;
  customerId: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  deviceInfo: {
    deviceId: string;
    ipAddress: string;
    userAgent: string;
  };
}

interface ValidationResponse {
  transactionId: string;
  status: 'approved' | 'rejected' | 'suspicious';
  riskScore: number;
  reasons?: string[];
}

export const transactionService = {
  async validateTransaction(data: TransactionValidationRequest): Promise<ValidationResponse> {
    try {
      const response: AxiosResponse<ValidationResponse> = await api.post(
        '/validate-transaction',
        data,
        {
          headers: {
            'X-Transaction-Signature': generateTransactionSignature(data),
            'X-Device-Id': data.deviceInfo.deviceId,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Transaction validation failed');
    }
  },

  private generateTransactionSignature(data: TransactionValidationRequest): string {
    // Implement HMAC signature for request validation
    const hmac = crypto.createHmac('sha256', process.env.REACT_APP_API_SECRET || '');
    hmac.update(JSON.stringify(data));
    return hmac.digest('hex');
  }
}; 