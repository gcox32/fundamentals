import { useState } from 'react';
import InvestorSelector from './InvestorSelector';
import InvestorAssessment from './InvestorAssessment';
import styles from './styles.module.css';

export default function SuperAssessment() {
    const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null);
	return (
        <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Super Investor Assessment</h2>
        <div className={styles.card}>
            {/* Selector Row */}
            <InvestorSelector selectedInvestor={selectedInvestor} setSelectedInvestor={setSelectedInvestor} />

            {/* Content Row */}
            {selectedInvestor && (
                <InvestorAssessment selectedInvestor={selectedInvestor} />
            )}
        </div>
    </section>
	);
}