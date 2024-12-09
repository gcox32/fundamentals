import { useState, useEffect, useRef } from 'react';
import type { TooltipProps, Position } from './types';
import './styles.css';

export default function Tooltip({ text, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentTooltip = e.currentTarget;
    if (currentTooltip && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left - 140,
        y: rect.bottom + 5
      });
      setIsVisible(prev => !prev);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div className="tooltip-container">
      <span className="tooltip-label">
        {children}
        <span 
          ref={iconRef}
          className="info-icon"
          onClick={handleClick}
        >
          ⓘ
        </span>
      </span>
      {isVisible && (
        <div 
          ref={tooltipRef}
          className="tooltip-modal"
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <div className="tooltip-modal-content">
            {text}
          </div>
        </div>
      )}
    </div>
  );
}