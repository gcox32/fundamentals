import React from 'react';
import styles from './styles.module.css';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export default function Tooltip({ children, content }: TooltipProps) {
  return (
    <div className={styles.tooltipContainer}>
      {children}
      <div className={styles.tooltipContent}>
        {content}
      </div>
    </div>
  );
} 