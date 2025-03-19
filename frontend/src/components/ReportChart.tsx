import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';

interface ReportChartProps {
  type: 'fraudTrends' | 'riskDistribution';
  dateRange: { start: Date | null; end: Date | null };
}

export const ReportChart: React.FC<ReportChartProps> = ({ type, dateRange }) => {
  const fraudTrendsData = [
    {
      id: 'Fraud Cases',
      data: [
        { x: 'Jan', y: 12 },
        { x: 'Feb', y: 19 },
        { x: 'Mar', y: 3 },
        { x: 'Apr', y: 5 },
        { x: 'May', y: 2 },
        { x: 'Jun', y: 3 },
      ],
    },
  ];

  const riskDistributionData = [
    { risk: 'Low', value: 65 },
    { risk: 'Medium', value: 59 },
    { risk: 'High', value: 80 },
    { risk: 'Critical', value: 81 },
  ];

  return (
    <div className="bg-gray-800 p-4 rounded-lg" style={{ height: '400px' }}>
      {type === 'fraudTrends' ? (
        <ResponsiveLine
          data={fraudTrendsData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
          axisTop={null}
          axisRight={null}
          enablePoints={true}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          theme={{
            textColor: '#fff',
            grid: { line: { stroke: '#444' } },
          }}
        />
      ) : (
        <ResponsiveBar
          data={riskDistributionData}
          keys={['value']}
          indexBy="risk"
          margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
          theme={{
            textColor: '#fff',
            grid: { line: { stroke: '#444' } },
          }}
        />
      )}
    </div>
  );
}; 