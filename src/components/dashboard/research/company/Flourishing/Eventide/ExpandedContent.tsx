import React from 'react';
import Image from 'next/image';
import { FaUsers, FaHandshake, FaTree, FaGlobeAmericas, FaCity } from 'react-icons/fa';
import styles from './styles.module.css';

interface ExpandedContentProps {
    standardContent: React.ReactNode;
}

export default function ExpandedContent({ standardContent }: ExpandedContentProps) {
    const stakeholderMetrics = {
        employees: { score: 8.7, impact: "Strong employee development and well-being programs" },
        suppliers: { score: 8.2, impact: "Fair partnership practices and sustainable sourcing" },
        community: { score: 8.9, impact: "Significant local economic and social contribution" },
        environment: { score: 9.1, impact: "Industry-leading environmental stewardship" },
        society: { score: 8.5, impact: "Positive broader societal impact through operations" }
    };

    const businessScreens = {
        avoid: {
            score: 9.2,
            highlights: [
                "No significant controversies",
                "Strong ethical practices",
                "Transparent governance"
            ]
        },
        embrace: {
            score: 8.8,
            highlights: [
                "Industry best practices adoption",
                "Stakeholder engagement",
                "Innovation leadership"
            ]
        },
        engage: {
            score: 8.5,
            highlights: [
                "Active community participation",
                "Strategic partnerships",
                "Industry influence"
            ]
        }
    };

    const valueAddMetrics = {
        score: 9.0,
        description: "Products/services significantly contribute to human flourishing",
        evidence: [
            "Sustainable product design",
            "Positive social impact measurement",
            "Customer well-being focus"
        ]
    };

    return (
        <>
            {standardContent}
            <div className={styles.additionalContent}>
                <section className={styles.stakeholderSection}>
                    <h3>Stakeholder Impact Analysis</h3>
                    <div className={styles.stakeholderGrid}>
                        {Object.entries(stakeholderMetrics).map(([key, metric]) => (
                            <div key={key} className={styles.stakeholderCard}>
                                <div className={styles.stakeholderIcon}>
                                    {getStakeholderIcon(key)}
                                </div>
                                <h4>{capitalize(key)}</h4>
                                <div className={styles.stakeholderScore}>{metric.score}/10</div>
                                <p>{metric.impact}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.business360Section}>
                    <h3>Business 360° Assessment</h3>
                    <div className={styles.screenGrid}>
                        {Object.entries(businessScreens).map(([screen, data]) => (
                            <div key={screen} className={styles.screenCard}>
                                <h4>{capitalize(screen)} Screen</h4>
                                <div className={styles.screenScore}>{data.score}/10</div>
                                <ul>
                                    {data.highlights.map((highlight, index) => (
                                        <li key={index}>{highlight}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.valueAddSection}>
                    <h3>Value Creation Assessment</h3>
                    <div className={styles.valueAddCard}>
                        <div className={styles.valueAddScore}>
                            <span>{valueAddMetrics.score}</span>/10
                        </div>
                        <p className={styles.valueAddDescription}>
                            {valueAddMetrics.description}
                        </p>
                        <ul className={styles.valueAddEvidence}>
                            {valueAddMetrics.evidence.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </section>

                <div className={styles.logoContainer}>
                    <Image 
                        src="/images/eventide-logo.svg"
                        alt="Eventide Logo"
                        width={120}
                        height={40}
                        className={styles.logo}
                    />
                </div>
            </div>
        </>
    );
}

function getStakeholderIcon(stakeholder: string) {
    switch (stakeholder) {
        case 'employees': return <FaUsers />;
        case 'suppliers': return <FaHandshake />;
        case 'community': return <FaCity />;
        case 'environment': return <FaTree />;
        case 'society': return <FaGlobeAmericas />;
        default: return null;
    }
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
} 