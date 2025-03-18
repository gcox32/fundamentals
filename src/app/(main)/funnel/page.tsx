'use client';

import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';

const FunnelPage = () => {
    const funnelStages = [
        {
            id: 'universe',
            title: 'Investment Universe',
            description: 'The broad universe of publicly traded companies across global markets.',
            count: '~45,000',
            color: '#4A90E2'
        },
        {
            id: 'initial',
            title: 'Initial Screen',
            description: 'Companies that meet basic financial and ethical criteria.',
            count: '~15,000',
            color: '#50C878'
        },
        {
            id: 'business360',
            title: 'Business 360° Analysis',
            description: 'Companies demonstrating strong business fundamentals and stakeholder value creation.',
            count: '~3,000',
            color: '#FFB549'
        },
        {
            id: 'flourishing',
            title: 'Flourishing Screen',
            description: 'Companies actively contributing to human flourishing through their products and practices.',
            count: '~1,000',
            color: '#FF7F50'
        },
        {
            id: 'portfolio',
            title: 'Portfolio Selection',
            description: 'Companies that meet our strict valuation criteria and fit our investment themes.',
            count: '~200',
            color: '#9370DB'
        }
    ];

    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Investment Selection Process</h1>
                <p className={styles.subtitle}>
                    Our rigorous, multi-stage screening process identifies companies that demonstrate 
                    both financial excellence and commitment to human flourishing.
                </p>
            </section>

            <section className={styles.funnelSection}>
                {funnelStages.map((stage, index) => (
                    <div 
                        key={stage.id}
                        className={styles.funnelStage}
                        style={{
                            '--stage-color': stage.color,
                            '--stage-width': `${100 - (index * 15)}%`
                        } as React.CSSProperties}
                    >
                        <div className={styles.stageContent}>
                            <h3 className={styles.stageTitle}>{stage.title}</h3>
                            <p className={styles.stageDescription}>{stage.description}</p>
                            <div className={styles.stageCount}>{stage.count} Companies</div>
                        </div>
                    </div>
                ))}
            </section>

            <section className={styles.processDescription}>
                <h2>Our Comprehensive Approach</h2>
                <p>
                    At Eventide, we believe that successful investing requires looking beyond traditional 
                    metrics. Our process integrates financial analysis with our Business 360® framework 
                    to identify companies that create compelling value for society while maintaining 
                    strong business fundamentals.
                </p>
            </section>
        </main>
    );
};

export default FunnelPage;