import WebSocket from 'ws';
import { Server } from 'http';
import { TransactionData } from './types';

export class AlertSystem {
  private wss: WebSocket.Server;
  
  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws) => {
      ws.on('error', console.error);
    });
  }

  broadcastAlert(transaction: TransactionData, risks: string[]) {
    const alert = {
      type: 'FRAUD_ALERT',
      transaction,
      risks,
      timestamp: new Date().toISOString()
    };

    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(alert));
      }
    });
  }
} 