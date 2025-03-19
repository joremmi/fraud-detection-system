export interface Transaction {
  id?: string;
  amount: number;
  timestamp: string;
  user_id?: string;
  description?: string;
}

export interface TransactionData extends Transaction {
  status?: 'approved' | 'suspicious' | 'rejected';
  fraud_probability?: number;
  location?: string;
  risk_factors?: string[];
} 