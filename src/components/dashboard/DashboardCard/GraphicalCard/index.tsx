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
                    <ChartContext.Provider value={contextValue}>
                        <div onClick={onClick} className={styles.clickableContent}>
                            <div className={styles.cardHeader}>
                                <div
                                    className={styles.dragHandle}
                                    {...attributes}
                                    {...listeners}
                                >
                                    <FaGripVertical />
                                </div>

                                <div className={styles.cardActions}>
                                    <FaEyeSlash
                                        className={styles.hideIcon}
                                        onClick={handleHide}
                                        title="Hide graph"
                                    />
                                    {!isLoading && !noData && (
                                        <FaExpand
                                            className={styles.expandIcon}
                                            onClick={handleExpand}
                                            title="Expand graph"
                                        />
                                    )}
                                </div>
                            </div>
                            {children}
                        </div>
                    </ChartContext.Provider>
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