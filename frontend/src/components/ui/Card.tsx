// frontend/src/components/ui/Card.tsx

import React, { ReactNode } from 'react';
import { cn } from "../../lib/utils.ts"; // Utility function for class names

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
