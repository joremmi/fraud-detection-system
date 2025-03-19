import React, { ReactNode } from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: number;
  trendLabel?: string;
  icon?: ReactNode;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  trend, 
  trendLabel,
  icon,
  className = ''
}) => {
  return (
    <div className={`rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              {trend > 0 ? (
                <span className="flex items-center text-green-400 text-sm">
                  <FiArrowUp className="mr-1" />
                  {trend}%
                </span>
              ) : trend < 0 ? (
                <span className="flex items-center text-red-400 text-sm">
                  <FiArrowDown className="mr-1" />
                  {Math.abs(trend)}%
                </span>
              ) : (
                <span className="text-gray-400 text-sm">0%</span>
              )}
              
              {trendLabel && (
                <span className="text-gray-500 text-xs ml-1">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-3 rounded-full bg-gray-800/70 text-blue-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard; 