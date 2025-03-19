import React from 'react';
import Card from '../ui/Card.tsx';

interface RiskThresholdConfigProps {
  riskThreshold: number;
  setRiskThreshold: (value: number) => void;
}

const RiskThresholdConfig: React.FC<RiskThresholdConfigProps> = ({ 
  riskThreshold, 
  setRiskThreshold 
}) => {
  return (
    <Card className="bg-gray-900/60 border border-gray-800/50 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">Risk Threshold Configuration</h2>
      <div className="flex items-center space-x-4">
        <span className="text-gray-300">Low Risk</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05" 
          value={riskThreshold} 
          onChange={(e) => setRiskThreshold(parseFloat(e.target.value))}
          className="w-full accent-blue-600"
        />
        <span className="text-gray-300">High Risk</span>
        <span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full">
          {riskThreshold.toFixed(2)}
        </span>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        Transactions with risk scores above this threshold will be flagged for review
      </div>
    </Card>
  );
};

export default RiskThresholdConfig; 