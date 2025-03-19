import React from 'react';
import Card from '../ui/Card.tsx';
import { FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

interface MetricsCardsProps {
  totalTransactions: number;
  suspiciousCount: number;
  totalAmount: number;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ 
  totalTransactions, 
  suspiciousCount, 
  totalAmount 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="bg-gray-900/60 border border-gray-800/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-400 text-sm">Total Transactions</h2>
            <p className="text-3xl font-bold text-white">{totalTransactions.toLocaleString()}</p>
          </div>
          <div className="bg-blue-900/30 p-3 rounded-full">
            <FiTrendingUp className="text-blue-400 text-xl" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <span className="text-green-400">↑ 3.2%</span> from previous period
        </div>
      </Card>
      
      <Card className="bg-gray-900/60 border border-gray-800/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-400 text-sm">Suspicious Activity</h2>
            <p className="text-3xl font-bold text-white">{suspiciousCount.toLocaleString()}</p>
          </div>
          <div className="bg-red-900/30 p-3 rounded-full">
            <FiAlertCircle className="text-red-400 text-xl" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <span className="text-red-400">↑ 5.8%</span> from previous period
        </div>
      </Card>
      
      <Card className="bg-gray-900/60 border border-gray-800/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-400 text-sm">Total Amount</h2>
            <p className="text-3xl font-bold text-white">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-green-900/30 p-3 rounded-full">
            <span className="text-green-400 text-xl font-bold">$</span>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <span className="text-green-400">↑ 2.5%</span> from previous period
        </div>
      </Card>
    </div>
  );
};

export default MetricsCards; 