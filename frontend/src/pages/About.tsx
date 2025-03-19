import React from 'react';
import Sidebar from '../components/Sidebar.tsx';

const About: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-950 text-white p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">About This System</h1>

          <div className="space-y-8">
            {/* Security Notice Section */}
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-400">⚠️ Important Security Notice</h2>
              <div className="space-y-2">
                <p>This system is for demonstration and development purposes only. Do NOT use real credit card numbers or sensitive financial data.</p>
                <ul className="list-disc list-inside ml-4 text-red-200">
                  <li>Cannot access actual credit card transaction history</li>
                  <li>Not connected to real banking networks</li>
                  <li>Not PCI compliant for real credit card data</li>
                </ul>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              <p className="mb-4">
                This system is designed to be integrated by businesses/merchants as part of their payment processing flow.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-blue-400">Data Analysis</h3>
                  <ul className="list-disc list-inside ml-4 text-gray-300">
                    <li>Transaction amount patterns</li>
                    <li>Geographic location changes</li>
                    <li>Transaction frequency</li>
                    <li>Timing of transactions</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-blue-400">Detection Methods</h3>
                  <ul className="list-disc list-inside ml-4 text-gray-300">
                    <li>Machine learning predictions</li>
                    <li>Rule-based pattern matching</li>
                    <li>Historical behavior analysis</li>
                    <li>Real-time risk scoring</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Integration Guide */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Integration Guide</h2>
              <div className="space-y-4">
                <p>For proper integration, this system should be:</p>
                <ul className="list-decimal list-inside ml-4 text-gray-300">
                  <li>Integrated into merchant payment systems</li>
                  <li>Connected to payment processing workflows</li>
                  <li>Used for pre-transaction validation</li>
                  <li>Configured with appropriate security measures</li>
                  <li>Part of a comprehensive fraud prevention strategy</li>
                </ul>
              </div>
            </div>

            {/* Demo Usage */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Testing the System</h2>
              <p className="mb-4">You can test the system using our sandbox mode with sample data:</p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
                  {`// Example test transaction
const testTransaction = {
  amount: 500,
  timestamp: new Date().toISOString(),
  location: "New York",
  user_id: "test_user_123",
  description: "Test Purchase"
};

// Send to API endpoint
await api.post('/api/transactions/validate', testTransaction);`}
                </pre>
              </div>
            </div>

            {/* Personal Use Alternatives */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Transaction Monitoring</h2>
              <p className="mb-4">For monitoring personal transactions, we recommend:</p>
              <ul className="list-disc list-inside ml-4 text-gray-300">
                <li>Using your bank's built-in fraud detection</li>
                <li>Signing up for credit monitoring services</li>
                <li>Enabling transaction alerts from your credit card issuer</li>
                <li>Reviewing statements regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;