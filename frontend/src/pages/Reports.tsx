import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.tsx';
import { api } from '../services/api.ts';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { format } from 'date-fns';

interface ReportMetrics {
  dailyTransactions: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  fraudRatio: number;
  totalAmount: number;
  averageTransactionSize: number;
}

const Reports: React.FC = () => {
  const [metrics, setMetrics] = useState<ReportMetrics>({
    dailyTransactions: [],
    fraudRatio: 0,
    totalAmount: 0,
    averageTransactionSize: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('7'); // days

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/api/reports/metrics?days=7');
        if (response?.data) {
          setMetrics(response.data);
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load report metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleDownloadReport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await api.get(`/api/reports/download?format=${format}`, {
        responseType: 'blob'
      } as any); // Type assertion needed for responseType
      
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/pdf' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fraud-report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download report');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-950 text-white p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <div className="flex gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              <button
                onClick={() => handleDownloadReport('csv')}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
              >
                Download CSV
              </button>
              <button
                onClick={() => handleDownloadReport('pdf')}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
              >
                Download PDF
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading report data...</div>
          ) : metrics ? (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl">
                  <h3 className="text-gray-400 mb-2">Fraud Ratio</h3>
                  <p className="text-2xl font-bold">
                    {(metrics.fraudRatio * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl">
                  <h3 className="text-gray-400 mb-2">Total Amount</h3>
                  <p className="text-2xl font-bold">
                    ${metrics.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl">
                  <h3 className="text-gray-400 mb-2">Avg Transaction</h3>
                  <p className="text-2xl font-bold">
                    ${metrics.averageTransactionSize.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Transaction Volume Chart */}
              <div className="bg-gray-900 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-6">Transaction Volume</h2>
                <div className="w-full overflow-x-auto">
                  <BarChart
                    width={800}
                    height={300}
                    data={metrics.dailyTransactions}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#3B82F6" name="Transactions" />
                  </BarChart>
                </div>
              </div>

              {/* Transaction Amount Chart */}
              <div className="bg-gray-900 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-6">Transaction Amount Trend</h2>
                <div className="w-full overflow-x-auto">
                  <LineChart
                    width={800}
                    height={300}
                    data={metrics.dailyTransactions}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#10B981" 
                      name="Amount ($)"
                    />
                  </LineChart>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Reports;
