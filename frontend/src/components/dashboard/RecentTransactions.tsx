import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card.tsx';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/40 text-green-300';
      case 'suspicious':
        return 'bg-red-900/40 text-red-300';
      case 'blocked':
        return 'bg-gray-700/40 text-gray-300';
      default:
        return 'bg-blue-900/40 text-blue-300';
    }
  };

  return (
    <Card className="bg-gray-900/60 border border-gray-800/50 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
        <Link to="/transactions" className="text-blue-400 text-sm hover:underline">
          View All
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-800">
              <th className="pb-3 font-medium text-gray-400">AMOUNT</th>
              <th className="pb-3 font-medium text-gray-400">STATUS</th>
              <th className="pb-3 font-medium text-gray-400">DATE</th>
              <th className="pb-3 font-medium text-gray-400">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-3 text-white font-medium">{formatCurrency(tx.amount)}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(tx.status)}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-3 text-gray-300">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="py-3 text-gray-300">{tx.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentTransactions; 