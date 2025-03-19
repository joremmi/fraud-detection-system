import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card.tsx';
import { api } from '../services/api.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import Sidebar from '../components/Sidebar.tsx';
import { FiAlertCircle, FiActivity, FiDollarSign, FiMapPin, FiTrendingUp, FiShield, FiGlobe, FiChevronDown, FiFilter, FiRefreshCw } from 'react-icons/fi';
import MetricCard from '../components/MetricCard.tsx';
import { Transaction } from '../types';

// Import components
import MetricsCards from '../components/dashboard/MetricsCards.tsx';
import RiskThresholdConfig from '../components/dashboard/RiskThresholdConfig.tsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.tsx';
import GeographicAnalysis from '../components/dashboard/GeographicAnalysis.tsx';
import BehavioralPatterns from '../components/dashboard/BehavioralPatterns.tsx';
import AlertConfiguration from '../components/dashboard/AlertConfiguration.tsx';
import SecurityCompliance from '../components/dashboard/SecurityCompliance.tsx';
import TransactionHeatmap from '../components/dashboard/TransactionHeatmap.tsx';

interface DashboardMetrics {
  totalTransactions: number;
  suspiciousCount: number;
  totalAmount: number;
  recentTransactions: Transaction[];
  geographicData: any;
  heatmapData: any;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalTransactions: 0,
    suspiciousCount: 0,
    totalAmount: 0,
    recentTransactions: [],
    geographicData: {},
    heatmapData: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [riskThreshold, setRiskThreshold] = useState(0.7);
  const [alertSettings, setAlertSettings] = useState({
    email: true,
    push: false,
    sms: true,
    threshold: 'medium'
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/dashboard/metrics');
      setMetrics(response.data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Add this function to format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-950">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 ml-64">
          <div className="flex justify-center items-center h-full">
            <div className="text-white">Loading dashboard data...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-950">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 ml-64">
          <div className="flex justify-center items-center h-full">
            <div className="text-red-400">{error}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 ml-64">
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.name || 'User'}. Here's your fraud detection overview.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <span className="mr-2">Refresh</span>
              </button>
              <span className="text-gray-400 text-sm">
                Last updated: {formatRelativeTime(lastUpdate)}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'geographic' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                }`}
                onClick={() => setActiveTab('geographic')}
              >
                Geographic Analysis
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'behavioral' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                }`}
                onClick={() => setActiveTab('behavioral')}
              >
                Behavioral Patterns
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'configuration' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                }`}
                onClick={() => setActiveTab('configuration')}
              >
                System Configuration
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <>
              <MetricsCards 
                totalTransactions={metrics.totalTransactions} 
                suspiciousCount={metrics.suspiciousCount} 
                totalAmount={metrics.totalAmount} 
              />
              
              <RiskThresholdConfig 
                riskThreshold={riskThreshold} 
                setRiskThreshold={setRiskThreshold} 
              />
              
              <RecentTransactions 
                transactions={metrics.recentTransactions} 
              />
            </>
          )}

          {activeTab === 'geographic' && (
            <>
              <GeographicAnalysis geographicData={metrics.geographicData} />
              
              <TransactionHeatmap 
                heatmapData={metrics.heatmapData || generateMockHeatmapData()} 
              />
            </>
          )}

          {activeTab === 'behavioral' && (
            <BehavioralPatterns />
          )}

          {activeTab === 'configuration' && (
            <>
              <AlertConfiguration 
                alertSettings={alertSettings} 
                setAlertSettings={setAlertSettings} 
              />
              
              <SecurityCompliance />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper function to generate mock heatmap data for development
const generateMockHeatmapData = () => {
  const regions = [
    { id: 1, name: "North America", lat: 40, lng: -100, riskLevel: "low", value: 0.2 },
    { id: 2, name: "Eastern Europe", lat: 50, lng: 20, riskLevel: "high", value: 0.9 },
    { id: 3, name: "Southeast Asia", lat: 10, lng: 106, riskLevel: "medium", value: 0.6 },
    { id: 4, name: "West Africa", lat: 8, lng: 0, riskLevel: "high", value: 0.85 },
    { id: 5, name: "Middle East", lat: 25, lng: 45, riskLevel: "medium", value: 0.55 },
    { id: 6, name: "South America", lat: -15, lng: -60, riskLevel: "low", value: 0.35 }
  ];
  
  return {
    regions,
    statistics: {
      topRegion: "Eastern Europe",
      topRegionIncrease: "+22%",
      newHotspots: 3,
      newHotspotRegion: "Southeast Asia",
      timeRange: "Last 24 hours"
    }
  };
};

export default Dashboard;