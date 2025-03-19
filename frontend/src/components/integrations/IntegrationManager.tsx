import React, { useState, useEffect } from 'react';
import { IntegrationConfig, IntegrationStatus, integrationService } from '../../services/integrations/IntegrationService';

const SUPPORTED_PROVIDERS = [
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '💳',
    description: 'Payment processing and fraud prevention'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🌐',
    description: 'Online payment solutions'
  },
  {
    id: 'square',
    name: 'Square',
    icon: '⬜',
    description: 'Point of sale and payment processing'
  }
];

const IntegrationManager: React.FC = () => {
  const [integrations, setIntegrations] = useState<Record<string, IntegrationStatus>>({});
  const [configuring, setConfiguring] = useState<string | null>(null);
  const [config, setConfig] = useState<Partial<IntegrationConfig>>({});

  useEffect(() => {
    loadIntegrationStatuses();
  }, []);

  const loadIntegrationStatuses = async () => {
    const statuses: Record<string, IntegrationStatus> = {};
    for (const provider of SUPPORTED_PROVIDERS) {
      statuses[provider.id] = await integrationService.getIntegrationStatus(provider.id);
    }
    setIntegrations(statuses);
  };

  const handleConfigure = async (provider: string) => {
    setConfiguring(provider);
    setConfig({
      provider: provider as IntegrationConfig['provider'],
      environment: 'sandbox'
    });
  };

  const handleSaveConfig = async () => {
    if (!configuring || !config.apiKey) return;

    const success = await integrationService.configureIntegration(config as IntegrationConfig);
    if (success) {
      await loadIntegrationStatuses();
      setConfiguring(null);
      setConfig({});
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Integration Manager</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUPPORTED_PROVIDERS.map(provider => (
          <div key={provider.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">{provider.icon}</span>
              <h3 className="text-xl font-semibold">{provider.name}</h3>
            </div>
            
            <p className="text-gray-400 mb-4">{provider.description}</p>
            
            {integrations[provider.id]?.isConnected ? (
              <div className="flex items-center justify-between">
                <span className="text-green-500">Connected</span>
                <button 
                  onClick={() => handleConfigure(provider.id)}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Reconfigure
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleConfigure(provider.id)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Configure
              </button>
            )}
          </div>
        ))}
      </div>

      {configuring && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Configure {configuring}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">API Key</label>
                <input
                  type="password"
                  value={config.apiKey || ''}
                  onChange={e => setConfig({...config, apiKey: e.target.value})}
                  className="w-full bg-gray-800 rounded p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Environment</label>
                <select
                  value={config.environment}
                  onChange={e => setConfig({...config, environment: e.target.value as 'sandbox' | 'production'})}
                  className="w-full bg-gray-800 rounded p-2"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfiguring(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationManager; 