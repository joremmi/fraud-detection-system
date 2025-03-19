export interface Transaction {
  id: string;
  amount: number;
  date: string;
  status: 'approved' | 'suspicious' | 'blocked';
  description: string;
  // Optional fields for the Transactions page
  riskScore?: number;
  userId?: string;
  userName?: string;
  location?: string;
} 