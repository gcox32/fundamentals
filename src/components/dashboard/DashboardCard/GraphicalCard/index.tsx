import React, { useState } from 'react';
import DashboardCard from '../index';
import styles from './styles.module.css';
import { FaExpand, FaGripVertical, FaEyeSlash } from 'react-icons/fa';
import Modal from '@/components/common/Modal';
import { ChartContext } from './ChartContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GraphicalCardProps {
    id: string;
    title: string;
    isLoading?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    noData?: boolean;
    timeframe: string;
    isTTM: boolean;
    onHide?: (id: string) => void;
}

export default function GraphicalCard({
    id,
    title,
    isLoading,
    children,
    onClick,
    noData,
    timeframe,
    isTTM,
    onHide
}: GraphicalCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTopPosition, setModalTopPosition] = useState(0);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        const clickY = e.clientY;
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Calculate optimal modal position
        const topPosition = Math.min(
            Math.max(clickY + scrollY - 100, 0),
            document.body.scrollHeight - windowHeight
        );
        
        // Scroll to the clicked position
        window.scrollTo({
            top: topPosition,
            behavior: 'smooth'
        });

        setIsModalOpen(true);
    };

    const handleHide = (e: React.MouseEvent) => {
        e.stopPropagation();
        onHide?.(id);
    };

    const contextValue = {
        isExpanded: false,
        timeframe,
        isTTM
    };

    const modalContextValue = {
        isExpanded: true,
        timeframe,
        isTTM
    };

    return (
        <>
            <div ref={setNodeRef} style={style}>
                <DashboardCard
                    title={title}
                    isLoading={isLoading}
                    className={`${styles.graphicalCard} ${isDragging ? styles.dragging : ''}`}
                >
                    <div className={styles.cardHeader}>
                        <FaGripVertical className={styles.dragHandle} {...listeners} {...attributes} />
                        <div className={styles.cardActions}>
                            <FaEyeSlash
                                className={styles.hideIcon}
                                onClick={handleHide}
                                title="Hide card"
                            />
                            <FaExpand
                                className={styles.expandIcon}
                                onClick={handleExpand}
                                title="Expand card"
                            />
                        </div>
                    </div>
                    <div className={styles.clickableContent} onClick={onClick}>
                        <ChartContext.Provider value={contextValue}>
                            {children}
                        </ChartContext.Provider>
                    </div>
                </DashboardCard>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                maxWidth="90%"
            >
                <ChartContext.Provider value={modalContextValue}>
                    <div className={styles.expandedContent}>
                        {children}
                    </div>
                </ChartContext.Provider>
            </Modal>
        </>
    );
}