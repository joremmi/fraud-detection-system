import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

const MFASetup: React.FC = () => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Call API to get QR code and secret
    const setupMFA = async () => {
      try {
        const response = await fetch('/api/mfa/setup');
        const data = await response.json();
        setQrCode(data.qrCode);
        setSecret(data.secret);
      } catch (error) {
        console.error('Error setting up MFA:', error);
      }
    };
    setupMFA();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Set Up Two-Factor Authentication</h1>
        
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            {qrCode && <QRCode value={qrCode} className="mb-4" />}
            <p className="text-sm text-gray-400 text-center">
              Scan this QR code with your authenticator app
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Verification Code</label>
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              placeholder="Enter code from authenticator app"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            onClick={() => {/* TODO: Implement verification */}}
          >
            Verify and Enable
          </button>
        </div>
      </div>
    </div>
  );
};

export default MFASetup;
