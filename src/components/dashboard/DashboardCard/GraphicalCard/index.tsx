import React, { useState } from 'react';
import DashboardCard from '../index';
import styles from './styles.module.css';
import { FaExpandAlt } from 'react-icons/fa';
import Modal from './Modal';
import { ChartContext } from './ChartContext';

interface GraphicalCardProps {
    title: string;
    isLoading?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    noData?: boolean;
    timeframe: string;
}

export default function GraphicalCard({ 
    title, 
    isLoading, 
    children, 
    onClick, 
    noData,
    timeframe 
}: GraphicalCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    const contextValue = {
        isExpanded: false,
        timeframe
    };

    const modalContextValue = {
        isExpanded: true,
        timeframe
    };

    return (
        <>
            <DashboardCard 
                title={title} 
                isLoading={isLoading}
                className={styles.graphicalCard}
            >
                <ChartContext.Provider value={contextValue}>
                    <div onClick={onClick} className={styles.clickableContent}>
                        {children}
                        {!isLoading && !noData && (
                            <FaExpandAlt 
                                className={styles.expandIcon} 
                                onClick={handleExpand}
                            />
                        )}
                    </div>
                </ChartContext.Provider>
            </DashboardCard>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
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