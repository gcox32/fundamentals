'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import PortfolioCard from '@/src/components/dashboard/portfolio/common/PortfolioCard';
import CreatePortfolioButton from '@/src/components/dashboard/portfolio/common/CreatePortfolioButton';
import { useUser } from '@/contexts/UserContext';
import styles from './styles.module.css';
import Modal from '@/components/common/Modal';
import type { Portfolio } from '@/types/portfolio';
import SelectPortfolio from '@/src/components/dashboard/portfolio/common/SelectPortfolio';
import PortfolioLoadingSkeleton from '@/components/dashboard/portfolio/LoadingSkeleton';

const client = generateClient<Schema>();

export default function Portfolio() {
	const { user, isLoading: isUserLoading, error: userError } = useUser();
	const [portfolios, setPortfolios] = useState<any[]>([]);
	const [activePortfolio, setActivePortfolio] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null);

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

	const handleCreatePortfolio = async (name: string) => {
		if (!user) return;

		try {
			const { data: newPortfolio } = await client.models.Portfolio.create({
				name,
				userId: (user as any).id
			});

			if (newPortfolio) {
				setPortfolios(prev => [...prev, newPortfolio]);
				setActivePortfolio(newPortfolio);
			}
		} catch (err) {
			console.error('Error creating portfolio:', err);
			setError('Failed to create portfolio');
		}
	};

	const handleDeletePortfolio = async (portfolioId: string) => {
		try {
			await client.models.Portfolio.delete({
				id: portfolioId
			});
			setPortfolios(prev => {
				const newPortfolios = prev.filter(p => p.id !== portfolioId);
				if (activePortfolio?.id === portfolioId) {
					setActivePortfolio(newPortfolios[0] || null);
				}
				return newPortfolios;
			});
		} catch (err) {
			console.error('Error deleting portfolio:', err);
			setError('Failed to delete portfolio');
		}
	};

	if (isUserLoading || isLoading) {
    return <PortfolioLoadingSkeleton />;
	}

	if (userError || error) {
		return <div className={styles.error}>Error: {userError || error}</div>;
	}

	if (!user) {
		return <div className={styles.error}>User not found</div>;
	}

	return (
		<div className={styles.container}>
			{activePortfolio && (
				<PortfolioCard
					portfolio={activePortfolio}
					onDelete={(portfolio) => setPortfolioToDelete(portfolio)}
				/>
			)}
			<div className={`${styles.portfolioOptions} mt-auto`}>
				<div className="flex xsm:flex-row flex-col justify-end items-center gap-4">
					<SelectPortfolio
						portfolios={portfolios}
						activePortfolio={activePortfolio}
						setActivePortfolio={setActivePortfolio}
					/>
					<CreatePortfolioButton onCreatePortfolio={handleCreatePortfolio} />
				</div>
			</div>

			<Modal
				isOpen={!!portfolioToDelete}
				onClose={() => setPortfolioToDelete(null)}
				title="Delete Portfolio"
			>
				<div className="space-y-4">
					<p>
						Are you sure you want to delete portfolio "{portfolioToDelete?.name}"?
						This action cannot be undone and will delete all positions within this portfolio.
					</p>
					<div className="flex justify-end gap-3">
						<button
							onClick={() => setPortfolioToDelete(null)}
							className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-800 transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={() => {
								if (portfolioToDelete) {
									handleDeletePortfolio(portfolioToDelete.id);
									setPortfolioToDelete(null);
								}
							}}
							className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white transition-colors"
						>
							Delete Portfolio
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
