import React from 'react';
import { FaEye, FaEyeSlash, FaExpand, FaGripVertical } from 'react-icons/fa';
import styles from './styles.module.css';

interface FlourishingCardProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onHide?: (id: string) => void;
  onExpand?: (id: string) => void;
  isDragging?: boolean;
  dragHandleListeners?: Record<string, any>;
}

export default function FlourishingCard({
  id,
  title,
  children,
  onHide,
  onExpand,
  isDragging,
  dragHandleListeners
}: FlourishingCardProps) {
  return (
    <div className={`${styles.flourishingCard} ${isDragging ? styles.dragging : ''}`}>
      <div className={styles.cardHeader}>
        <FaGripVertical className={styles.dragHandle} {...dragHandleListeners} />
        <h3>{title}</h3>
        <div className={styles.cardActions}>
          {onExpand && (
            <FaExpand
              className={styles.expandIcon}
              onClick={() => onExpand(id)}
            />
          )}
          <FaEyeSlash
            className={styles.hideIcon}
            onClick={() => onHide?.(id)}
          />
        </div>
      </div>
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
} 