import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../types';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const RealTimeNotifications: React.FC = () => {
  const [socket, setSocket] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<Transaction[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const socketUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001'
      : '';
      
    const newSocket = io(socketUrl, {
      withCredentials: true,
      auth: {
        token: localStorage.getItem('auth_token')
      }
    });
    
    newSocket.on('connect', () => {
      console.log('Connected to real-time notification service');
    });
    
    newSocket.on('newTransaction', (transaction: Transaction) => {
      if (transaction.riskScore && transaction.riskScore > 0.7) {
        setNotifications(prev => [transaction, ...prev].slice(0, 5));
        
        // Show browser notification if supported
        if (Notification.permission === 'granted') {
          new Notification('High Risk Transaction Detected', {
            body: `Transaction ${transaction.id} has a risk score of ${transaction.riskScore.toFixed(2)}`
          });
        }
      }
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, [user]);
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map(transaction => (
        <div 
          key={transaction.id}
          className="bg-red-900/90 border border-red-700 p-4 rounded-lg shadow-lg max-w-sm animate-slideIn flex"
        >
          <div className="mr-3 text-red-500">
            <FiAlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium">High Risk Transaction</h4>
            <p className="text-red-200 text-sm mt-1">
              Transaction {transaction.id} for ${transaction.amount} has a risk score of {transaction.riskScore?.toFixed(2)}
            </p>
          </div>
          <button 
            onClick={() => removeNotification(transaction.id)}
            className="text-red-300 hover:text-white"
          >
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
};

export default RealTimeNotifications; 