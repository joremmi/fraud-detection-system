import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.tsx';
import { api } from '../services/api.ts';

interface SettingsState {
  thresholdScore: number;
  enableNotifications: boolean;
  emailAlerts: boolean;
  autoBlockThreshold: number;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    thresholdScore: 0.7,
    enableNotifications: true,
    emailAlerts: true,
    autoBlockThreshold: 0.9,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/api/settings');
      if (response?.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleChange = (name: keyof SettingsState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : parseFloat(event.target.value);
    
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await api.post('/api/settings', settings);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-950 text-white p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">System Settings</h1>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fraud Detection Threshold Score
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={settings.thresholdScore}
                  onChange={handleChange('thresholdScore')}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 w-full max-w-md"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Score threshold for flagging suspicious transactions (0-1)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Auto-block Threshold
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={settings.autoBlockThreshold}
                  onChange={handleChange('autoBlockThreshold')}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 w-full max-w-md"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Transactions above this score will be automatically blocked (0-1)
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={handleChange('enableNotifications')}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
                  />
                  <span>Enable Push Notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={handleChange('emailAlerts')}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
                  />
                  <span>Enable Email Alerts</span>
                </label>
              </div>

              <div>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>

          {showSuccess && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
              Settings saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;