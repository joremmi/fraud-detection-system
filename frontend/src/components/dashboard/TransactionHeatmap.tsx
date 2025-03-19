import React, { useState, useEffect, useRef } from 'react';
import { FiGlobe } from 'react-icons/fi';

interface HeatmapRegion {
  id: number;
  name: string;
  lat: number;
  lng: number;
  riskLevel: string;
  value: number;
}

interface HeatmapStatistics {
  topRegion: string;
  topRegionIncrease: string;
  newHotspots: number;
  newHotspotRegion: string;
  timeRange: string;
}

interface TransactionHeatmapProps {
  heatmapData: {
    regions: HeatmapRegion[];
    statistics: HeatmapStatistics;
  };
}

const TransactionHeatmap: React.FC<TransactionHeatmapProps> = ({ heatmapData }) => {
  const [view, setView] = useState('global');
  const [heatmapType, setHeatmapType] = useState('attempts');
  const [timeRange, setTimeRange] = useState('24h');
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [lastUpdated] = useState(new Date());

  useEffect(() => {
    // Set initial dimensions
    if (mapRef.current) {
      setMapDimensions({ 
        width: mapRef.current.offsetWidth, 
        height: mapRef.current.offsetHeight 
      });
    }

    // Add resize listener
    const handleResize = () => {
      if (mapRef.current) {
        setMapDimensions({ 
          width: mapRef.current.offsetWidth, 
          height: mapRef.current.offsetHeight 
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Convert latitude/longitude to x/y coordinates on the map
  const geoToPixel = (lat: number, lng: number): [number, number] => {
    // Simple Mercator projection
    const x = (lng + 180) * (mapDimensions.width / 360);
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
    const y = (mapDimensions.height / 2) - (mapDimensions.width * mercN / (2 * Math.PI));
    return [x, y];
  };

  // Get color and size based on risk level
  const getRiskVisuals = (riskLevel: string, value: number) => {
    let color = '';
    let size = 0;
    
    if (riskLevel === 'high' || value >= 0.7) {
      color = 'rgba(239, 68, 68, 0.8)'; // red
      size = 40;
    } else if (riskLevel === 'medium' || value >= 0.4) {
      color = 'rgba(245, 158, 11, 0.8)'; // amber/orange
      size = 30;
    } else {
      color = 'rgba(251, 191, 36, 0.7)'; // yellow
      size = 20;
    }
    
    return { color, size };
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800/50 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Fraud Activity Heatmap</h2>
        <div className="flex items-center">
          <FiGlobe className="text-blue-400 mr-2" />
          <select 
            className="bg-gray-800 text-white border border-gray-700 rounded text-sm p-1"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="global">Global View</option>
            <option value="north-america">North America</option>
            <option value="europe">Europe</option>
            <option value="asia">Asia</option>
            <option value="africa">Africa</option>
          </select>
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        className="relative h-80 bg-gray-900 rounded-lg overflow-hidden mb-4"
      >
        {/* World map base layer - would be a proper map in production */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 opacity-30">
          World Map Base Layer
        </div>
        
        {/* Heatmap dots */}
        {heatmapData.regions.map(region => {
          const [x, y] = geoToPixel(region.lat, region.lng);
          const { color, size } = getRiskVisuals(region.riskLevel, region.value);
          
          return (
            <React.Fragment key={region.id}>
              {/* Glow effect */}
              <div 
                className="absolute rounded-full blur-md"
                style={{
                  backgroundColor: color,
                  width: size * 2,
                  height: size * 2,
                  left: x - size,
                  top: y - size,
                  opacity: 0.6
                }}
              />
              
              {/* Core dot */}
              <div 
                className="absolute rounded-full"
                style={{
                  backgroundColor: color,
                  width: size,
                  height: size,
                  left: x - size/2,
                  top: y - size/2,
                  opacity: 0.8
                }}
              />
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center space-x-6 mb-3 px-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-gray-300 text-sm">High Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <span className="text-gray-300 text-sm">Medium Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
          <span className="text-gray-300 text-sm">Low Risk</span>
        </div>
        <div className="ml-auto text-gray-400 text-sm">
          Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Top Region</div>
          <div className="font-medium text-white">{heatmapData.statistics.topRegion}</div>
          <div className="text-xs text-red-400">{heatmapData.statistics.topRegionIncrease} from last week</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">New Hotspots</div>
          <div className="font-medium text-white">{heatmapData.statistics.newHotspots} detected</div>
          <div className="text-xs text-yellow-400">{heatmapData.statistics.newHotspotRegion}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Time Range</div>
          <div className="font-medium text-white">{heatmapData.statistics.timeRange}</div>
          <div className="text-xs text-blue-400">
            <select 
              className="bg-transparent border-none p-0 text-blue-400"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">24 hours</option>
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
            </select>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Heatmap Type</div>
          <div className="font-medium text-white">Fraud Attempts</div>
          <div className="text-xs text-blue-400">
            <select 
              className="bg-transparent border-none p-0 text-blue-400"
              value={heatmapType}
              onChange={(e) => setHeatmapType(e.target.value)}
            >
              <option value="attempts">Fraud Attempts</option>
              <option value="amount">Fraud Amount</option>
              <option value="success">Success Rate</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHeatmap;