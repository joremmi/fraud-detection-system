import React, { useEffect, useState } from 'react';
import { wsService } from '../../services/websocket';

interface Alert {
  id: string;
  type: 'fraud' | 'suspicious' | 'info';
  message: string;
  timestamp: string;
  transactionId?: string;
}

const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    wsService.subscribe('FRAUD_ALERT', (alert: Alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 50));
      showNotification(alert);
    });

    return () => {
      wsService.unsubscribe('FRAUD_ALERT');
    };
  }, []);

  const showNotification = (alert: Alert) => {
    if (Notification.permission === 'granted') {
      new Notification('Fraud Alert', {
        body: alert.message,
        icon: '/alert-icon.png'
      });
    }
  };

  return (
    <div className={`fixed right-4 bottom-4 bg-gray-900 rounded-lg shadow-lg ${
      isExpanded ? 'w-96' : 'w-12'
    } transition-all duration-300`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        {isExpanded ? '×' : '!'}
      </button>
      
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto p-4">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`mb-2 p-3 rounded ${
                alert.type === 'fraud' ? 'bg-red-900' :
                alert.type === 'suspicious' ? 'bg-yellow-900' :
                'bg-blue-900'
              }`}
            >
              <div className="font-bold">{alert.message}</div>
              <div className="text-sm text-gray-400">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertSystem; 