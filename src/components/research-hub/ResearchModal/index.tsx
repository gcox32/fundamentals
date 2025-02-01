import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import { FaTimes, FaChartLine, FaUsers, FaGlobe, FaShieldAlt, FaLeaf } from 'react-icons/fa';

interface Company {
    symbol: string;
    name: string;
    description: string;
    totalPercentage: number;
    assetType: string;
}

interface ResearchModalProps {
    company: Company;
    onClose: () => void;
}

export default function ResearchModal({ company, onClose }: ResearchModalProps) {
    const getCompanyLogoUrl = (symbol: string) =>
        `https://assets.letmedemo.com/public/fundamental/icons/companies/${symbol.replace('.', '')}.png`;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const symbol = img.alt;

        img.src = `https://storage.googleapis.com/iex/api/logos/${symbol}.png`;

        img.onerror = () => {
            img.src = '/images/placeholder.png';
            img.onerror = null;
        };
    };

    const researchMetrics = {
        businessModel: {
            score: 8.7,
            strengths: [
                "Market leadership in core segments",
                "Strong recurring revenue model",
                "High barriers to entry"
            ],
            risks: [
                "Regulatory environment changes",
                "Market competition intensity",
                "Technology disruption potential"
            ]
        },
        stakeholderValue: {
            score: 8.9,
            metrics: {
                customers: 9.1,
                employees: 8.8,
                suppliers: 8.7,
                community: 9.0,
                environment: 8.9,
                society: 9.2
            }
        },
        flourishingMetrics: {
            score: 8.8,
            categories: [
                { name: "Sustainable Competitive Advantage", score: 9.0 },
                { name: "Attractive Industry", score: 8.7 },
                { name: "Management Team", score: 8.8 },
                { name: "Creation of Compelling Value", score: 8.9 }
            ]
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FaTimes />
                </button>

                <div className={styles.header}>
                    <div className={styles.logoContainer}>
                        <Image
                            src={getCompanyLogoUrl(company.symbol)}
                            alt={company.symbol}
                            width={80}
                            height={80}
                            className={styles.companyLogo}
                            onError={handleImageError}
                            unoptimized
                        />
                    </div>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.companyName}>{company.name}</h1>
                        <p className={styles.companySymbol}>{company.symbol}</p>
                    </div>
                </div>

                <div className={styles.reportContent}>
                    <div className={styles.researchGrid}>
                        <section className={styles.mainSection}>
                            <h2>Executive Analysis</h2>
                            <p className={styles.executiveSummary}>{company.description}</p>

                            <div className={styles.metricsOverview}>
                                <div className={styles.metricCard}>
                                    <div className={styles.businessModel}>
                                        <h3>Business Model</h3>
                                        <div className={styles.score}>{researchMetrics.businessModel.score}/10</div>
                                    </div>
                                    <div className={styles.strengthsRisks}>
                                        <div>
                                            <h4>Key Strengths</h4>
                                            <ul>
                                                {researchMetrics.businessModel.strengths.map((strength, i) => (
                                                    <li key={i}>{strength}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4>Risk Factors</h4>
                                            <ul>
                                                {researchMetrics.businessModel.risks.map((risk, i) => (
                                                    <li key={i}>{risk}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.longFormAnalysis}>
                                <h3>Investment Considerations</h3>
                                <p>
                                    {company.name} demonstrates strong market positioning with sustainable competitive advantages 
                                    in their core business segments. Their commitment to stakeholder-focused value creation is 
                                    evident in their above-average scores across key metrics. The company's business model shows 
                                    resilience through economic cycles, supported by recurring revenue streams and high barriers 
                                    to entry.
                                </p>
                                <p>
                                    Management's strategic initiatives align well with long-term value creation, particularly in 
                                    their focus on innovation and sustainable business practices. The company's flourishing 
                                    metrics indicate strong potential for continued positive impact across social, environmental, 
                                    and governance dimensions.
                                </p>
                            </div>
                            <div className={styles.disclaimer}>
                                <p>
                                    <strong>Investment Disclaimer:</strong> The analysis provided here is for informational 
                                    purposes only and should not be considered as investment advice or a recommendation to buy 
                                    or sell any security. This research represents a point-in-time assessment and does not 
                                    capture all factors that may influence investment decisions. Please conduct your own due 
                                    diligence and consult with a financial advisor before making any investment decisions.
                                </p>
                            </div>
                        </section>

                        <aside className={styles.sideSection}>
                            <div className={styles.stakeholderMetrics}>
                                <h3>Business 360 &reg;</h3>
                                <div className={styles.overallScore}>
                                    {researchMetrics.stakeholderValue.score}
                                    <span>/10</span>
                                </div>
                                {Object.entries(researchMetrics.stakeholderValue.metrics).map(([key, value]) => (
                                    <div key={key} className={styles.metricRow}>
                                        <span className={styles.metricLabel}>{key}</span>
                                        <div className={styles.metricBar}>
                                            <div
                                                className={styles.metricFill}
                                                style={{ width: `${value * 10}%` }}
                                            />
                                        </div>
                                        <span className={styles.metricValue}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.flourishingMetrics}>
                                <h3>Quality Score</h3>
                                <div className={styles.flourishingGrid}>
                                    {researchMetrics.flourishingMetrics.categories.map((category, i) => (
                                        <div key={i} className={styles.flourishingCard}>
                                            <h4>{category.name}</h4>
                                            <div className={styles.categoryScore}>{category.score}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
} 