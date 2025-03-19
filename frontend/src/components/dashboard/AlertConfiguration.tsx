import React from 'react';
import Card from '../ui/Card.tsx';

interface AlertSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  threshold: string;
}

interface AlertConfigurationProps {
  alertSettings: AlertSettings;
  setAlertSettings: (settings: AlertSettings) => void;
}

const AlertConfiguration: React.FC<AlertConfigurationProps> = ({ 
  alertSettings, 
  setAlertSettings 
}) => {
  const handleToggle = (key: keyof AlertSettings) => {
    if (typeof alertSettings[key] === 'boolean') {
      setAlertSettings({
        ...alertSettings,
        [key]: !alertSettings[key as 'email' | 'push' | 'sms']
      });
    }
  };

  const handleThresholdChange = (threshold: string) => {
    setAlertSettings({
      ...alertSettings,
      threshold
    });
  };

  return (
    <Card className="bg-gray-900/60 border border-gray-800/50 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Alert Configuration</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
          Save Changes
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-medium text-white mb-3">Notification Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="email-alerts" 
                className="rounded bg-gray-700 border-gray-600 text-blue-600 mr-2"
                checked={alertSettings.email}
                onChange={() => handleToggle('email')}
              />
              <label htmlFor="email-alerts" className="text-gray-300">
                Email Alerts
              </label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="push-notifications" 
                className="rounded bg-gray-700 border-gray-600 text-blue-600 mr-2"
                checked={alertSettings.push}
                onChange={() => handleToggle('push')}
              />
              <label htmlFor="push-notifications" className="text-gray-300">
                Push Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="sms-alerts" 
                className="rounded bg-gray-700 border-gray-600 text-blue-600 mr-2"
                checked={alertSettings.sms}
                onChange={() => handleToggle('sms')}
              />
              <label htmlFor="sms-alerts" className="text-gray-300">
                SMS Alerts
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-medium text-white mb-3">Alert Threshold</h3>
          <select 
            value={alertSettings.threshold}
            onChange={(e) => handleThresholdChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded p-2"
          >
            <option value="low">Low (All Suspicious Activities)</option>
            <option value="medium">Medium (Moderate Risk and Above)</option>
            <option value="high">High (Critical Risk Only)</option>
          </select>
          <p className="text-sm text-gray-400 mt-2">
            Adjust the threshold at which alerts are triggered
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AlertConfiguration; 