import { WebSocket, Server } from 'ws';
import { TransactionData } from '../types/index';

export class AlertSystem {
  private wss: Server;

  constructor(server: any) {
    this.wss = new Server({ server });
    this.initialize();
  }

  public initialize() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected to alert system');

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      ws.on('close', () => {
        console.log('Client disconnected from alert system');
      });
    });
  }

  public broadcastAlert(transaction: TransactionData, risks: string[]) {
    const alert = {
      type: 'FRAUD_ALERT',
      transaction,
      risks,
      timestamp: new Date().toISOString()
    };

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(alert));
      }
    });
  }
} 