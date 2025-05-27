import { HistoricalPriceData } from "@/types/stock";
import styles from "@/app/(main)/portfolio/summary/styles.module.css";

interface BackTestingProps {
    portfolioHistoricalPrices: HistoricalPriceData[];
}

export default function BackTesting({portfolioHistoricalPrices}: BackTestingProps)  {
    console.log(portfolioHistoricalPrices);
    return (
        <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Historical Performance</h2>
        <div className={styles.card}>
            <div className={styles.grid}>
                <div className={styles.subsection}>
                    <h3 className={styles.subsectionTitle}>Performance Metrics</h3>
                    <p className={styles.subsectionContent}>Key performance indicators will be displayed here</p>
                </div>
                <div className={styles.subsection}>
                    <h3 className={styles.subsectionTitle}>Performance Chart</h3>
                    <p className={styles.subsectionContent}>Historical performance visualization will be shown here</p>
                </div>
            </div>
        </div>
    </section>
    )
}