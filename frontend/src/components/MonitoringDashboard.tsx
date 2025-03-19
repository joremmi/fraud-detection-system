import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../services/api.ts';

interface MetricsData {
  fraudRate: Array<{ timestamp: string; value: number }>;
  responseTime: Array<{ timestamp: string; value: number }>;
  throughput: Array<{ timestamp: string; value: number }>;
}

const MonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData>({
    fraudRate: [],
    responseTime: [],
    throughput: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/api/metrics/real-time');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-4">Fraud Rate</h3>
          <LineChart width={400} height={200} data={metrics.fraudRate}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#EF4444" />
          </LineChart>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-4">Response Time (ms)</h3>
          <LineChart width={400} height={200} data={metrics.responseTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3B82F6" />
          </LineChart>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-4">Throughput</h3>
          <LineChart width={400} height={200} data={metrics.throughput}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#10B981" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;