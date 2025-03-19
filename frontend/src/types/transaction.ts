export interface TransactionData {
  id: string;
  amount: number;
  timestamp: string;
  status: 'approved' | 'suspicious' | 'rejected';
  is_fraudulent?: boolean;
  processedAt?: string;
  description?: string;
  user_id?: number;
}

export interface FraudMetrics {
  totalTransactions: number;
  suspiciousCount: number;
  totalAmount: number;
}

export interface Transaction {
  id: number;
  amount: number;
  timestamp: string;
  status: string;
  description: string;
  user_id?: number;
} 