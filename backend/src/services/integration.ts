import axios from 'axios';

export class IntegrationService {
  static async validateWithPaymentProcessor(transaction: Transaction) {
    const response = await axios.post(
      process.env.PAYMENT_PROCESSOR_URL!,
      {
        transactionId: transaction.id,
        amount: transaction.amount,
        // Add other required fields
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PAYMENT_PROCESSOR_API_KEY}`
        }
      }
    );
    
    return response.data;
  }
} 