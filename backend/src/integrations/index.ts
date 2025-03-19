export interface IntegrationProvider {
  name: string;
  validateTransaction: (transaction: Transaction) => Promise<ValidationResult>;
  handleWebhook: (payload: any) => Promise<void>;
}