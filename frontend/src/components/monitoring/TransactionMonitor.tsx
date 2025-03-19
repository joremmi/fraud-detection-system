import React, { useState, useEffect } from 'react';
import { TransactionData } from '../../types/transaction';
import { wsService } from '../../services/websocket';
import { Card } from '../ui/Card';

interface MonitoringStats {
  realtimeVolume: number;
  avgResponseTime: number;
  activeAlerts: number;
}

const calculateResponseTime = (transaction: TransactionData): number => {
  const processingTime = transaction.processedAt 
    ? new Date(transaction.processedAt).getTime() - new Date(transaction.timestamp).getTime()
    : 0;
  return processingTime;
};

const TransactionMonitor: React.FC = () => {
  const [liveTransactions, setLiveTransactions] = useState<TransactionData[]>([]);
  const [stats, setStats] = useState<MonitoringStats>({
    realtimeVolume: 0,
    avgResponseTime: 0,
    activeAlerts: 0
  });

  useEffect(() => {
    wsService.subscribe('TRANSACTION_UPDATE', (transaction: TransactionData) => {
      setLiveTransactions(prev => [transaction, ...prev].slice(0, 10));
      updateStats(transaction);
    });

    return () => wsService.unsubscribe('TRANSACTION_UPDATE');
  }, []);

  const updateStats = (transaction: TransactionData) => {
    setStats(prev => ({
      realtimeVolume: prev.realtimeVolume + 1,
      avgResponseTime: calculateResponseTime(transaction),
      activeAlerts: prev.activeAlerts + (transaction.status === 'suspicious' ? 1 : 0)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <h3>Real-time Volume</h3>
          <p className="text-2xl">{stats.realtimeVolume}/min</p>
        </Card>
        <Card>
          <h3>Avg Response Time</h3>
          <p className="text-2xl">{stats.avgResponseTime}ms</p>
        </Card>
        <Card>
          <h3>Active Alerts</h3>
          <p className="text-2xl">{stats.activeAlerts}</p>
        </Card>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg">
        <h3 className="text-xl mb-4">Live Transactions</h3>
        <div className="space-y-2">
          {liveTransactions.map(tx => (
            <div key={tx.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
              <span>${tx.amount}</span>
              <span className={`px-2 py-1 rounded ${
                tx.status === 'approved' ? 'bg-green-500/20' : 
                tx.status === 'suspicious' ? 'bg-yellow-500/20' : 
                'bg-red-500/20'
              }`}>
                {tx.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionMonitor; 