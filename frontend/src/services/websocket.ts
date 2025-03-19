import { TransactionData } from '../types/transaction.ts';
type MessageHandler = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private subscribers: Record<string, Function[]> = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private url: string;

  constructor() {
    // Use the current hostname with the correct backend port
    // Change this to match your actual backend port and path
    const backendPort = '3001'; // Your backend is running on port 3001 based on the logs
    this.url = `ws://${window.location.hostname}:${backendPort}/ws`;
    console.log('WebSocket URL configured as:', this.url);
  }

  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      console.log(`Connecting to WebSocket at ${this.url}...`);
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket received message:', data);
          
          if (data.type && this.subscribers[data.type]) {
            this.subscribers[data.type].forEach(callback => callback(data.data || data));
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.reconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached, giving up');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, 1000 * Math.pow(2, this.reconnectAttempts)); // Exponential backoff
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  subscribe(type: string, callback: Function) {
    if (!this.subscribers[type]) {
      this.subscribers[type] = [];
    }
    this.subscribers[type].push(callback);
    console.log(`Subscribed to ${type} events`);
  }

  unsubscribe(type: string, callback?: Function) {
    if (!this.subscribers[type]) return;
    
    if (callback) {
      this.subscribers[type] = this.subscribers[type].filter(cb => cb !== callback);
    } else {
      delete this.subscribers[type];
    }
    console.log(`Unsubscribed from ${type} events`);
  }
}

export const wsService = new WebSocketService(); 