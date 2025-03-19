import axios from 'axios';
import { TransactionData } from '../types';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000/predict';

export function loadModel() {
  // No need to load the model in TypeScript as it's handled by Python service
  return true;
}

export async function predict(_model: any, transaction: TransactionData): Promise<number> {
  try {
    const response = await axios.post(ML_SERVICE_URL, {
      amount: transaction.amount,
      timestamp: transaction.timestamp
    });
    
    return response.data.probability;
  } catch (error) {
    console.error('ML prediction error:', error);
    // Return a conservative estimate if ML service fails
    return 0.9;
  }
} 