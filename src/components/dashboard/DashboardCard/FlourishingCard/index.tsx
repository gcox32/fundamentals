import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaExpand, FaGripVertical } from 'react-icons/fa';
import Modal from '@/components/common/Modal';
import styles from './styles.module.css';

interface FlourishingCardProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onHide?: (id: string) => void;
  isDragging?: boolean;
  dragHandleListeners?: Record<string, any>;
  expandedContent?: React.ReactNode;
}

export default function FlourishingCard({
  id,
  title,
  children,
  onHide,
  isDragging,
  dragHandleListeners,
  expandedContent
}: FlourishingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExpand = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={`${styles.flourishingCard} ${isDragging ? styles.dragging : ''}`}>
        <div className={styles.cardHeader}>
          <FaGripVertical className={styles.dragHandle} {...dragHandleListeners} />
          <h3>{title}</h3>
          <div className={styles.cardActions}>
            <FaEyeSlash
              className={styles.hideIcon}
              onClick={() => onHide?.(id)}
              title="Hide card"
            />
            <FaExpand
              className={styles.expandIcon}
              onClick={handleExpand}
              title="Expand card"
            />
          </div>
        </div>
        <div className={styles.cardContent}>
          {children}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        maxWidth="90%"
      >
        <div className={styles.expandedContent}>
          {expandedContent || children}
        </div>
      </Modal>
    </>
  );
} 