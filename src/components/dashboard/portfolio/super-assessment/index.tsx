import { useEffect, useState } from 'react';
import InvestorSelector from './InvestorSelector';
import InvestorAssessment from './InvestorAssessment';
import styles from './styles.module.css';

interface Position {
    ticker: string;
    weight: number;
}

interface PositionWeights {
    investor: string | null;
    userId: string;
    holdings: Array<Position>;
}

interface SuperAssessmentProps {
    positionWeights: PositionWeights;
}

export default function SuperAssessment({ positionWeights }: SuperAssessmentProps) {
    const { userId, holdings } = positionWeights;
    const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null);
    const [assessment, setAssessment] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
    const [generatedAt, setGeneratedAt] = useState<string | null>(null);

    useEffect(() => {
        if (selectedInvestor) {
            fetchAssessment();
        }
    }, [selectedInvestor]);

    const fetchAssessment = async (forceRefresh = false) => {
        setStatus('loading');
        setAssessment(null);
        try {
            const res = await fetch('/api/portfolio/super-assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ investor: selectedInvestor, userId, holdings, forceRefresh }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setAssessment(data.text);
            setGeneratedAt(data.generatedAt || null);
            setStatus('idle');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Super Investor Assessment</h2>
            <div className={styles.card}>
                {/* Selector Row */}
                <InvestorSelector selectedInvestor={selectedInvestor} setSelectedInvestor={setSelectedInvestor} />

                {/* Content Row */}
                {selectedInvestor && (
                    <InvestorAssessment
                        investor={selectedInvestor}
                        status={status}
                        assessment={assessment}
                        generatedAt={generatedAt}
                        fetchAssessment={fetchAssessment}
                    />
                )}
            </div>
        </section>
    );
}