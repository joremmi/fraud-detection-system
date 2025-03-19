import React, { useState, useEffect } from 'react';
import { wsService } from '../../services/websocket.ts';
import { Card } from '../ui/Card.tsx';

interface Alert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  transactionId: string;
}

const AlertDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  useEffect(() => {
    wsService.subscribe('FRAUD_ALERT', (alert: Alert) => {
      setAlerts(prev => [alert, ...prev]);
    });
    
    return () => wsService.unsubscribe('FRAUD_ALERT');
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Active Alerts</h2>
      <div className="grid gap-4">
        {alerts.map(alert => (
          <Card key={alert.id} className={`
            ${alert.severity === 'high' ? 'bg-red-900/30 border-red-800/40' : 
              alert.severity === 'medium' ? 'bg-yellow-900/30 border-yellow-800/40' :
              'bg-blue-900/30 border-blue-800/40'}
          `}>
            <div className="flex justify-between">
              <span className="font-medium">{alert.message}</span>
              <span className="text-sm opacity-70">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlertDashboard;