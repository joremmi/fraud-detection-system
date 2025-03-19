import { WebSocket } from 'ws';
import { TransactionData } from '../types';

export class DashboardHandler {
  private clients: Set<WebSocket> = new Set();

  addClient(ws: WebSocket) {
    this.clients.add(ws);
    ws.on('close', () => this.clients.delete(ws));
  }

  broadcastMetricsUpdate(metrics: {
    totalTransactions: number;
    suspiciousCount: number;
    fraudRatio: number;
    recentAlerts: TransactionData[];
  }) {
    const message = JSON.stringify({
      type: 'METRICS_UPDATE',
      data: metrics
    });

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  broadcastHighRiskAlert(transaction: TransactionData, risks: string[]) {
    const message = JSON.stringify({
      type: 'HIGH_RISK_ALERT',
      data: { transaction, risks }
    });

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
} 