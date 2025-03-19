import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-700/50 rounded ${className}`}
    />
  );
};

export default Skeleton; 