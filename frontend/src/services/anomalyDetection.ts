import { Transaction } from '../types';

// Simple frequency analysis for similar transactions
export const detectTransactionAnomalies = (
  currentTransaction: Transaction, 
  recentTransactions: Transaction[]
): { isAnomaly: boolean; reason: string } => {
  // Check for unusually high amount
  const userTransactions = recentTransactions.filter(
    tx => tx.userId === currentTransaction.userId
  );
  
  if (userTransactions.length === 0) {
    return { isAnomaly: false, reason: 'Not enough history' };
  }
  
  // Calculate average transaction amount for this user
  const averageAmount = userTransactions.reduce(
    (sum, tx) => sum + tx.amount, 0
  ) / userTransactions.length;
  
  // Flag if transaction amount is 3x the user's average
  if (currentTransaction.amount > averageAmount * 3) {
    return { 
      isAnomaly: true, 
      reason: `Amount (${currentTransaction.amount}) is significantly higher than user average (${averageAmount.toFixed(2)})` 
    };
  }
  
  // Check for unusual transaction frequency
  const last24Hours = new Date();
  last24Hours.setHours(last24Hours.getHours() - 24);
  
  const recentCount = recentTransactions.filter(tx => 
    tx.userId === currentTransaction.userId && 
    new Date(tx.date) >= last24Hours
  ).length;
  
  if (recentCount > 10) {
    return { 
      isAnomaly: true, 
      reason: `Unusual activity: ${recentCount} transactions in the last 24 hours` 
    };
  }
  
  // Location-based anomaly
  const userLocations = userTransactions.map(tx => tx.location);
  if (currentTransaction.location && 
      !userLocations.includes(currentTransaction.location)) {
    return { 
      isAnomaly: true, 
      reason: `Transaction from new location: ${currentTransaction.location}` 
    };
  }
  
  return { isAnomaly: false, reason: 'No anomalies detected' };
};

// Apply this in your transaction detail page
export const analyzeTransaction = async (transaction: Transaction): Promise<string[]> => {
  // Fetch recent transactions for comparison
  // This would be an API call in a real implementation
  const recentTransactions = await fetch('/api/transactions/recent')
    .then(res => res.json());
  
  const risks: string[] = [];
  
  // 1. Check for anomalies
  const anomalyResult = detectTransactionAnomalies(transaction, recentTransactions);
  if (anomalyResult.isAnomaly) {
    risks.push(anomalyResult.reason);
  }
  
  // 2. Check for common fraud patterns
  if (transaction.amount === Math.round(transaction.amount)) {
    risks.push('Rounded amount (common in fraud attempts)');
  }
  
  if (transaction.location) {
    // Check for high-risk locations (this would be a more sophisticated check in production)
    const highRiskLocations = ['Nigeria', 'Belarus', 'North Korea'];
    if (highRiskLocations.some(loc => transaction.location?.includes(loc))) {
      risks.push('Transaction from high-risk location');
    }
  }
  
  return risks;
}; 