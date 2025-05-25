'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import { useUser } from '@/src/contexts/UserContext';
import styles from './styles.module.css';
import SuperAssessment from '@/src/components/dashboard/portfolio/super-assessment';

const client = generateClient<Schema>();

export default function AssessPortfolio() {
	const { user, isLoading: isUserLoading, error: userError } = useUser();
	const [portfolios, setPortfolios] = useState<any[]>([]);
	const [activePortfolio, setActivePortfolio] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null);

	useEffect(() => {
		if (user) {
			fetchPortfolios();
		}
	}, [user]);

	useEffect(() => {
		// Set the first portfolio as active when portfolios are loaded
		if (portfolios.length > 0 && !activePortfolio) {
			setActivePortfolio(portfolios[0]);
		}
	}, [portfolios]);

	const fetchPortfolios = async () => {
		console.log('fetching portfolios');
		if (!user) return;

		try {
			const userId = (user as any).id;
			const { data: portfolios } = await client.models.Portfolio.list({
				filter: { userId: { eq: userId } }
			});

			setPortfolios(portfolios || []);
		} catch (err) {
			console.error('Error fetching portfolios:', err);
			setError('Failed to load portfolios');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<div className="mb-8">
				<h1 className={styles.sectionTitle}>Portfolio Assessment</h1>

				{isLoading ? (
					<div className={styles.subsectionContent}>Loading portfolios...</div>
				) : error ? (
					<div className="text-red-600 dark:text-red-400">{error}</div>
				) : (
					<div className="space-y-4">
						<div className={styles.selectContainer}>
							<label htmlFor="portfolio-select" className={styles.selectLabel}>
								Select Portfolio:
							</label>
							<select
								id="portfolio-select"
								className={styles.select}
								value={activePortfolio?.id || ''}
								onChange={(e) => {
									const selected = portfolios.find(p => p.id === e.target.value);
									setActivePortfolio(selected);
								}}
							>
								{portfolios.map((portfolio) => (
									<option key={portfolio.id} value={portfolio.id}>
										{portfolio.name || 'Unnamed Portfolio'}
									</option>
								))}
							</select>
						</div>

						{activePortfolio && (
							<div className="mt-8 space-y-12">
								{/* Asset Allocation Section */}
								<section className={styles.section}>
									<h2 className={styles.sectionTitle}>Asset Allocation</h2>
									<div className={styles.card}>
										<div className={styles.grid}>
											<div className={styles.subsection}>
												<h3 className={styles.subsectionTitle}>Current Allocation</h3>
												<p className={styles.subsectionContent}>Allocation breakdown will be displayed here</p>
											</div>
											<div className={styles.subsection}>
												<h3 className={styles.subsectionTitle}>Target Allocation</h3>
												<p className={styles.subsectionContent}>Target allocation comparison will be shown here</p>
											</div>
										</div>
									</div>
								</section>

								{/* Historical Performance Section */}
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

								{/* Upcoming Events Section */}
								<section className={styles.section}>
									<h2 className={styles.sectionTitle}>Upcoming Events</h2>
									<div className={styles.card}>
										<div className={styles.grid}>
											<div className={styles.subsection}>
												<h3 className={styles.subsectionTitle}>Upcoming Dividends</h3>
												<p className={styles.subsectionContent}>Dividends will be displayed here</p>
											</div>
											<div className={styles.subsection}>
												<h3 className={styles.subsectionTitle}>Upcoming Earnings</h3>
												<p className={styles.subsectionContent}>Earnings will be displayed here</p>
											</div>
										</div>
									</div>
								</section>

								{/* Risk Assessment Section */}
								<section className={styles.section}>
									<h2 className={styles.sectionTitle}>Risk Assessment</h2>
									<div className={styles.card}>
										<div className={styles.grid}>
											<div className={styles.subsection}>
												<h3 className={styles.subsectionTitle}>Risk Metrics</h3>
												<p className={styles.subsectionContent}>Volatility and risk measures will be displayed here</p>
											</div>
											<div className={styles.subsection}>
												<h3 className={styles.subsectionTitle}>Risk Analysis</h3>
												<p className={styles.subsectionContent}>Detailed risk analysis and recommendations will be shown here</p>
											</div>
										</div>
									</div>
								</section>

								{/* Super Investor Section */}
								<SuperAssessment />
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}