import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface MetricPoint {
  timestamp: string;
  value: number;
}

interface MetricsData {
  fraudRate: MetricPoint[];
  responseTime: MetricPoint[];
  throughput: MetricPoint[];
}

const MetricsMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData>({
    fraudRate: [],
    responseTime: [],
    throughput: []
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch('/api/metrics/real-time');
      const data = await response.json();
      setMetrics(data);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-4 rounded-xl">
          <h3 className="text-lg font-medium mb-4">Fraud Rate Trend</h3>
          <LineChart width={400} height={200} data={metrics.fraudRate}>
            <XAxis dataKey="timestamp" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ background: '#1F2937' }} />
            <Line type="monotone" dataKey="value" stroke="#EF4444" />
          </LineChart>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl">
          <h3 className="text-lg font-medium mb-4">System Performance</h3>
          <LineChart width={400} height={200} data={metrics.responseTime}>
            <XAxis dataKey="timestamp" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ background: '#1F2937' }} />
            <Line type="monotone" dataKey="value" stroke="#3B82F6" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default MetricsMonitor;