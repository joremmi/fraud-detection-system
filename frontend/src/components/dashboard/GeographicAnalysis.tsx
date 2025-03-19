import React from 'react';
import Card from '../ui/Card.tsx';
import { FiMapPin } from 'react-icons/fi';

interface LocationShift {
  userId: string;
  from: string;
  to: string;
  timeDiff: string;
}

interface RiskRegion {
  region: string;
  riskLevel: 'High' | 'Medium' | 'Low';
}

interface GeographicAnalysisProps {
  geographicData: {
    locationShifts?: LocationShift[];
    riskRegions?: RiskRegion[];
  };
}

const GeographicAnalysis: React.FC<GeographicAnalysisProps> = ({ geographicData }) => {
  // Use mock data if none is provided
  const locationShifts = geographicData?.locationShifts || [
    { userId: '45892', from: 'NYC', to: 'London', timeDiff: '2hrs' },
    { userId: '32781', from: 'Paris', to: 'Singapore', timeDiff: '11hr' }
  ];
  
  const riskRegions = geographicData?.riskRegions || [
    { region: 'Southeast Asia', riskLevel: 'Medium' },
    { region: 'Eastern Europe', riskLevel: 'High' }
  ];

  const getRiskLevelClass = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return 'text-red-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-900/60 border border-gray-800/50 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">Geographic Anomalies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center text-yellow-400 mb-2">
            <FiMapPin className="mr-2" />
            <h3 className="font-medium">Location Shifts</h3>
          </div>
          <p className="text-sm text-gray-300 mb-3">Unusual location changes in the last 24 hours</p>
          
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-400">
              <div>User ID</div>
              <div className="col-span-2">Location Change</div>
              <div>Time</div>
            </div>
            
            {locationShifts.map((shift, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 bg-gray-700/30 p-2 rounded">
                <div className="text-gray-300">{shift.userId}</div>
                <div className="col-span-2 text-red-300">{shift.from} → {shift.to}</div>
                <div className="text-gray-300">{shift.timeDiff}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center text-blue-400 mb-2">
            <FiMapPin className="mr-2" />
            <h3 className="font-medium">High-Risk Regions</h3>
          </div>
          <p className="text-sm text-gray-300 mb-3">Regions with elevated fraud activity</p>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium text-gray-400">
              <div>Region</div>
              <div>Risk Level</div>
            </div>
            
            {riskRegions.map((region, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 bg-gray-700/30 p-2 rounded">
                <div className="text-gray-300">{region.region}</div>
                <div className={getRiskLevelClass(region.riskLevel)}>
                  {region.riskLevel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GeographicAnalysis; 