import React from 'react';
import { formatPrice } from '@/utils/format';

interface PriceRangeIndicatorProps {
  low: number;
  high: number;
  current: number;
  width?: number;
}

export default function PriceRangeIndicator({ low, high, current, width = 120 }: PriceRangeIndicatorProps) {
  // Calculate the position of the current price marker
  const range = high - low;
  const position = ((current - low) / range) * 100;
  
  return (
    <div className="flex flex-col space-y-1">
      <div className="relative" style={{ width }}>
        {/* Background line */}
        <div className="absolute w-full h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
        
        {/* Current price marker */}
        <div 
          className="absolute w-2 h-2 bg-blue-500 rounded-full -mt-0.75"
          style={{ 
            left: `${Math.min(Math.max(position, 0), 100)}%`,
            transform: 'translate(-50%, -40%)'
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatPrice(low)}</span>
        <span>{formatPrice(high)}</span>
      </div>
    </div>
  );
} 