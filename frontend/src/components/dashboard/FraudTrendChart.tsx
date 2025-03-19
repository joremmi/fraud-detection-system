// src/components/dashboard/FraudTrendChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import Card from '../ui/Card';

interface FraudTrendChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

const FraudTrendChart: React.FC<FraudTrendChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Fraud Index',
        data: data.values,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };
  
  return (
    <Card className="bg-gray-900/60 border border-gray-800/50">
      <h3 className="text-lg font-medium text-white mb-4">Fraud Activity Trend</h3>
      <div className="h-64">
        <Line data={chartData} options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }
          }
        }} />
      </div>
    </Card>
  );
};