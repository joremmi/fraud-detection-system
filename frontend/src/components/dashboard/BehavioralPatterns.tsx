import React from 'react';
import Card from '../ui/Card.tsx';
import { FiTrendingUp, FiShield } from 'react-icons/fi';

const BehavioralPatterns: React.FC = () => {
  return (
    <Card className="bg-gray-900/60 border border-gray-800/50 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">Behavioral Patterns</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center text-green-400 mb-2">
            <FiTrendingUp className="mr-2" />
            <h3 className="font-medium">Frequency Monitoring</h3>
          </div>
          <p className="text-sm text-gray-300 mb-3">Unusual transaction frequency detected</p>
          
          <div className="h-40 bg-gray-700/30 rounded flex items-center justify-center mb-3">
            <div className="text-center text-gray-400">
              <p>Transaction Frequency Chart</p>
              <p className="text-xs mt-1">(Visualization placeholder)</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-300">
            <div className="flex justify-between mb-1">
              <span>Average transactions per day:</span>
              <span className="text-white">35</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Current deviation:</span>
              <span className="text-red-400">+48%</span>
            </div>
            <div className="flex justify-between">
              <span>Anomaly confidence:</span>
              <span className="text-yellow-400">82%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center text-purple-400 mb-2">
            <FiShield className="mr-2" />
            <h3 className="font-medium">Auto-Blocking Status</h3>
          </div>
          <p className="text-sm text-gray-300 mb-3">Current auto-blocking settings</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">High-risk transactions</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Suspicious IP addresses</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Multiple failed attempts</span>
              <span className="bg-red-900/40 text-red-300 px-2 py-1 rounded text-xs">Disabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Unusual spending patterns</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Velocity checks</span>
              <span className="bg-yellow-900/40 text-yellow-300 px-2 py-1 rounded text-xs">Partial</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BehavioralPatterns; 