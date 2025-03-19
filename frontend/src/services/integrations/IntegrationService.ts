import { api } from '../api';

export interface IntegrationConfig {
  provider: 'stripe' | 'paypal' | 'square' | 'custom';
  apiKey: string;
  webhookUrl: string;
  environment: 'sandbox' | 'production';
  options?: Record<string, any>;
}

export interface IntegrationStatus {
  isConnected: boolean;
  lastSync: string;
  status: 'active' | 'error' | 'disconnected';
  errorMessage?: string;
}

export class IntegrationService {
  async configureIntegration(config: IntegrationConfig): Promise<boolean> {
    try {
      await api.post('/integrations/configure', {
        ...config,
        apiKey: this.encryptSensitiveData(config.apiKey)
      });
      return true;
    } catch (error) {
      console.error('Integration configuration failed:', error);
      return false;
    }
  }

  async getIntegrationStatus(provider: string): Promise<IntegrationStatus> {
    const response = await api.get(`/integrations/${provider}/status`);
    return response.data;
  }

  private encryptSensitiveData(data: string): string {
    // Use encryption service to secure sensitive data
    return btoa(data); // Basic encryption for demo, use proper encryption in production
  }
}

export const integrationService = new IntegrationService(); 