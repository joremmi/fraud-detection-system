import React from 'react';

interface ComponentErrorProps {
  message?: string;
  onRetry?: () => void;
}

const ComponentError: React.FC<ComponentErrorProps> = ({ 
  message = 'Something went wrong', 
  onRetry 
}) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="text-red-500 mb-2">Error</div>
      <p className="text-gray-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ComponentError; 