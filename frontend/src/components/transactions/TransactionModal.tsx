import React from 'react';
import { TransactionData } from '../../types/transaction';

interface TransactionModalProps {
  transaction: TransactionData | null;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Transaction Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
            <span className="text-gray-400">Amount</span>
            <span className="text-xl font-semibold">${transaction.amount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
            <span className="text-gray-400">Status</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              transaction.status === 'approved'
                ? 'bg-green-500/10 text-green-500'
                : 'bg-red-500/10 text-red-500'
            }`}>
              {transaction.status}
            </span>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
            <span className="text-gray-400">Date</span>
            <span>{new Date(transaction.timestamp).toLocaleString()}</span>
          </div>

          {transaction.description && (
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-400 block mb-2">Description</span>
              <span>{transaction.description}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal; 