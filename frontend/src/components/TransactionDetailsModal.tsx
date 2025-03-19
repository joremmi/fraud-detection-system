import React, { useState } from 'react';
import { Transaction } from '../types';
import { FiX, FiAlertCircle, FiUser, FiMap, FiCalendar, FiDollarSign, FiFileText } from 'react-icons/fi';
import { updateTransactionStatus, flagAsFraud } from '../services/api';

interface TransactionDetailsModalProps {
  transaction: Transaction;
  onClose: () => void;
  onUpdate?: (updatedTransaction: Transaction) => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ 
  transaction, 
  onClose,
  onUpdate 
}) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  const getRiskLevelClass = (score: number | undefined) => {
    if (!score) return 'bg-green-900/40 text-green-300';
    if (score > 0.7) return 'bg-red-900/40 text-red-300';
    if (score > 0.4) return 'bg-yellow-900/40 text-yellow-300';
    return 'bg-green-900/40 text-green-300';
  };
  
  const getRiskLevelText = (score: number | undefined) => {
    if (!score) return 'Low';
    if (score > 0.7) return 'High';
    if (score > 0.4) return 'Medium';
    return 'Low';
  };
  
  const handleStatusUpdate = async (newStatus: 'approved' | 'suspicious' | 'blocked') => {
    try {
      setUpdating(true);
      setError('');
      const updatedTransaction = await updateTransactionStatus(transaction.id, newStatus);
      if (onUpdate) {
        onUpdate(updatedTransaction);
      }
      onClose();
    } catch (err) {
      console.error('Error updating transaction status:', err);
      setError('Failed to update transaction status');
    } finally {
      setUpdating(false);
    }
  };
  
  const handleFlagAsFraud = async () => {
    try {
      setUpdating(true);
      setError('');
      const updatedTransaction = await flagAsFraud(transaction.id);
      if (onUpdate) {
        onUpdate(updatedTransaction);
      }
      onClose();
    } catch (err) {
      console.error('Error flagging transaction as fraud:', err);
      setError('Failed to flag transaction as fraud');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Transaction Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-400">Transaction ID</div>
            <div className="text-white font-mono bg-gray-800 px-3 py-1 rounded">{transaction.id}</div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <FiDollarSign />
              <span>Amount</span>
            </div>
            <div className="text-white font-medium text-xl">{formatCurrency(transaction.amount)}</div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <FiCalendar />
              <span>Date</span>
            </div>
            <div className="text-white">{formatDate(transaction.date)}</div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <FiUser />
              <span>User</span>
            </div>
            <div className="text-white">{transaction.userName || 'Unknown'}</div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <FiMap />
              <span>Location</span>
            </div>
            <div className="text-white">{transaction.location || 'Unknown'}</div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <FiAlertCircle />
              <span>Status</span>
            </div>
            <div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                transaction.status === 'approved' 
                  ? 'bg-green-900/40 text-green-300' 
                  : transaction.status === 'suspicious'
                    ? 'bg-red-900/40 text-red-300'
                    : 'bg-gray-700/40 text-gray-300'
              }`}>
                {transaction.status}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <FiAlertCircle />
              <span>Risk Score</span>
            </div>
            <div>
              <span className={`px-2 py-1 rounded-full ${getRiskLevelClass(transaction.riskScore)}`}>
                {getRiskLevelText(transaction.riskScore)} ({(transaction.riskScore ?? 0).toFixed(2)})
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <FiFileText />
              <span>Description</span>
            </div>
            <div className="text-white bg-gray-800 p-3 rounded">{transaction.description}</div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/40 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose}
            disabled={updating}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Close
          </button>
          
          {transaction.status === 'suspicious' && (
            <button 
              onClick={handleFlagAsFraud}
              disabled={updating}
              className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {updating ? 'Processing...' : 'Flag as Fraud'}
            </button>
          )}
          
          {transaction.status !== 'approved' && (
            <button 
              onClick={() => handleStatusUpdate('approved')}
              disabled={updating}
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {updating ? 'Processing...' : 'Approve Transaction'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal; 