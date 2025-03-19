import React from 'react';
import { encryptionService } from '../../services/encryption';

const DataPrivacy: React.FC = () => {
  const handleDataExport = async () => {
    // Implementation for GDPR data export
  };

  const handleDataDeletion = async () => {
    // Implementation for GDPR right to be forgotten
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Data Privacy & Compliance</h2>
      
      <div className="space-y-6">
        <div className="border border-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Data Protection Status</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Data Encryption Enabled
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              GDPR Compliance
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              PCI DSS Standards
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleDataExport}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Export Personal Data
          </button>
          <button
            onClick={handleDataDeletion}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Request Data Deletion
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacy; 