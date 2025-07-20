'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { data, type Schema } from '@/amplify/data/resource';
import { useUser } from '@/src/contexts/UserContext';
import type { Position } from '@/types/portfolio';
import styles from './styles.module.css';
import SuperAssessment from '@/src/components/dashboard/portfolio/super-assessment';
import { fetchValuationData } from '@/src/lib/valuation/fetchValuationData';
import Allocation from '@/src/components/dashboard/portfolio/allocation';
import BackTesting from '@/src/components/dashboard/portfolio/performance/BackTesting';
import { HistoricalPriceData } from '@/types/stock';
import SelectPortfolio from '@/src/components/dashboard/portfolio/common/SelectPortfolio';
import { CompanyEventDividends, CompanyEventEarnings } from '@/types/company';

const client = generateClient<Schema>();

export default function AssessPortfolio() {
	const { user, isLoading: isUserLoading, error: userError } = useUser();
	const [portfolios, setPortfolios] = useState<any[]>([]);
	const [positions, setPositions] = useState<any[]>([]);
	const [quotes, setQuotes] = useState<any[]>([]);
	const [positionWeights, setPositionWeights] = useState<any>(null);
	const [activePortfolio, setActivePortfolio] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isWeightsCalculated, setIsWeightsCalculated] = useState(false);
	const [portfolioCompanies, setPortfolioCompanies] = useState<any>(null);
	const [portfolioCompanyProfiles, setPortfolioCompanyProfiles] = useState<any>(null);
	const [portfolioHistoricalPrices, setPortfolioHistoricalPrices] = useState<{symbol: string, data: HistoricalPriceData}[]>([]);

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

	const fetchPositions = async () => {
		try {
			const { data } = await client.models.Position.list({
				filter: { portfolioId: { eq: activePortfolio.id } },
				authMode: 'userPool'
			});
			setPositions((data || []) as Position[]);
		} catch (err) {
			console.error('Error fetching positions:', err);
			setError('Failed to load positions');
		} finally {
			setIsLoading(false);
		}
	};

	const fetchQuotes = async () => {
		try {
			const symbols = positions.map(p => p.symbol).join(',');
			const response = await fetch(`/api/research/valuation/stocks/quotes?symbols=${symbols}&portfolioId=${activePortfolio.id}`);
			if (!response.ok) throw new Error('Failed to fetch quotes');
			const data = await response.json();
			setQuotes(data);
		} catch (err) {
			console.error('Error fetching quotes:', err);
			setError('Failed to load quotes');
		}
	};

	const calculatePositionWeights = () => {
		if (!positions.length || !Object.keys(quotes).length) return;

		// Calculate total portfolio value
		const totalValue = positions.reduce((sum, position) => {
			const quote = quotes[position.symbol];
			if (!quote) return sum;
			return sum + (position.quantity * quote.price);
		}, 0);

		// Calculate individual position weights
		const holdings = positions.map(position => {
			const quote = quotes[position.symbol];
			if (!quote) return null;
			const positionValue = position.quantity * quote.price;
			const weight = Math.round((positionValue / totalValue) * 100);
			return {
				ticker: position.symbol,
				weight
			};
		}).filter(Boolean);

		const weightsData = {
			investor: null,
			userId: activePortfolio.userId,
			date: new Date().toISOString().split('T')[0],
			holdings
		};

		setPositionWeights(weightsData);
		setIsWeightsCalculated(true);
	};

	const fetchCompanyData = async () => {
		try {
			const companyOutlookPromises = positions.map(position =>
				fetchValuationData(
					'company/outlook',
					position.symbol,
					(data) => {
						setPortfolioCompanies((prev: any[] | null) => {
							const newData = [...(prev || [])];
							const index = newData.findIndex(item => item?.symbol === position.symbol);
							if (index !== -1) {
								newData[index] = data;
							} else {
								newData.push(data);
							}

							return newData;
						})
						// Company Profile for distribution analysis
						setPortfolioCompanyProfiles((prev: any[] | null) => {
							const newData = [...(prev || [])];
							const index = newData.findIndex(item => item?.symbol === position.symbol);
							if (index !== -1) {
								newData[index] = data.profile;
							} else {
								newData.push(data.profile);
							}
							return newData;
						})
					},
					(err) => { console.error('Error fetching company data:', err) }
				)
			);
			// Historical Price for back testing
			const historicalPricePromises = positions.map(position =>
				fetchValuationData(
					'stock/historical/price',
					position.symbol,
					(data) => {
						setPortfolioHistoricalPrices((prev: any[] | null) => {
							const newData = [...(prev || [])];
							const index = newData.findIndex(item => item?.symbol === position.symbol);
							if (index !== -1) {
								newData[index] = { symbol: position.symbol, data: data };
							} else {
								newData.push({ symbol: position.symbol, data: data });
							}
							return newData;
						})
					},
					(err) => { console.error('Error fetching historical price data:', err) }
				)
			);
			await Promise.all(companyOutlookPromises);
			await Promise.all(historicalPricePromises);
		} catch (err) {
			console.error('Error fetching company data:', err);
			setError('Failed to load company data');
		}
	};

	const resetStateArrays = () => {
		setPositions([]);
		setQuotes([]);
		setPositionWeights(null);
		setPortfolioCompanies(null);
		setPortfolioCompanyProfiles(null);
		setPortfolioHistoricalPrices([]);
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, 100);
		});
	};

	useEffect(() => {
		if (activePortfolio?.id) {
			fetchPositions();
		}
	}, [activePortfolio]);

	useEffect(() => {
		if (positions.length > 0) {
			fetchQuotes();
		}
	}, [positions]);

	useEffect(() => {
		if (Object.keys(quotes).length > 0) {
			calculatePositionWeights();
		}
	}, [quotes]);

	useEffect(() => {
		if (positions.length > 0) {
			fetchCompanyData();
		}
	}, [isWeightsCalculated]);

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
							<SelectPortfolio
								portfolios={portfolios}
								activePortfolio={activePortfolio}
								setActivePortfolio={setActivePortfolio}
								setIsWeightsCalculated={setIsWeightsCalculated}
								resetStateArrays={resetStateArrays}
							/>
						</div>

						{activePortfolio && (
							<div className="space-y-16 mt-8">
								{/* Asset Allocation Section */}
								{positionWeights && portfolioCompanyProfiles && (
									<section className={styles.section}>
										<h2 className={styles.sectionTitle}>Asset Allocation</h2>
										<div className={styles.card}>
											<Allocation companyOutlooks={portfolioCompanies} weights={positionWeights.holdings} />
										</div>
									</section>
								)}

								{/* Historical Performance Section */}
								{positionWeights && portfolioHistoricalPrices && (
									<section className={styles.section}>
										<h2 className={styles.sectionTitle}>Historical Performance</h2>
										<div className={styles.card}>
											<BackTesting 
												portfolioHistoricalPrices={portfolioHistoricalPrices.map((price) => price.data)} 
												weights={positionWeights.holdings.map((weight: any) => weight.weight)} 
											/>
										</div>
									</section>
								)}

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
								{isWeightsCalculated ? (
									<SuperAssessment positionWeights={positionWeights} />
								) : (
									<div className={styles.subsectionContent}>Calculating position weights...</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}