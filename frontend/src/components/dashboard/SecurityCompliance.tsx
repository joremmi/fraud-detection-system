import React from 'react';
import Card from '../ui/Card.tsx';

const SecurityCompliance: React.FC = () => {
  return (
    <Card className="bg-gray-900/60 border border-gray-800/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Security & Compliance</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
          Generate Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-medium text-white mb-3">Compliance Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">GDPR Compliance</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs">Compliant</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">PCI DSS Standards</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs">Compliant</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Data Encryption</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Security Audit</span>
              <span className="bg-yellow-900/40 text-yellow-300 px-2 py-1 rounded text-xs">Due in 15 days</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-medium text-white mb-3">Integration Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Payment Gateway</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">E-commerce Platform</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Third-party Fraud Tools</span>
              <span className="bg-red-900/40 text-red-300 px-2 py-1 rounded text-xs">Disconnected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Webhook Notifications</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SecurityCompliance; 