import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SUPER_INVESTORS } from './config';
import ReactMarkdown from 'react-markdown';

interface InvestorAssessmentProps {
	investor: string;
	status: string;
	assessment: string | null;
	generatedAt: string | null;
	fetchAssessment: (forceRefresh: boolean) => void;
}

export default function InvestorAssessment({ investor, status, assessment, generatedAt, fetchAssessment }: InvestorAssessmentProps) {
	const segments = assessment?.split(/(\s+)/); // split by spaces to preserve formatting	
	const [visibleIndex, setVisibleIndex] = useState(0);

	useEffect(() => {
		if (status === 'idle' && assessment) {
			const interval = setInterval(() => {
				setVisibleIndex((prev) => Math.min(prev + 3, segments?.length || 0));
			}, 50); // 50ms per word
	
			return () => clearInterval(interval);
		}
	}, [assessment, status]);


	return (
		<div className="flex flex-col md:flex-row gap-8 h-[480px]">
			{/* Avatar */}
			<div className="md:w-1/4 w-full flex justify-center">
				<Image
					src={`https://assets.letmedemo.com/public/fundamental/investors/${investor}.png`}
					alt={`${investor} avatar`}
					width={200}
					height={200}
					className="rounded-xl object-cover border border-[var(--border-color)]"
				/>
			</div>

			{/* Assessment */}
			<div className="md:w-3/4 w-full overflow-y-scroll h-full">
				<h3 className="text-lg font-semibold mb-2 text-[var(--text)]">
					Assessment from {SUPER_INVESTORS.find(i => i.id === investor)?.name}
				</h3>
				{status === 'loading' && <p className="text-[var(--text-secondary)]">Generating assessment...</p>}
				{status === 'error' && <p className="text-[var(--text-secondary)]">Failed to fetch assessment.</p>}
				{assessment && (
					<div className="space-y-4">
					<ReactMarkdown>{segments?.slice(0, visibleIndex).join('')}</ReactMarkdown>
					{generatedAt && (
						<p className="text-sm text-[var(--text-secondary)]">Generated on {new Date(generatedAt).toLocaleString()}</p>
					)}
					<button
						className="mt-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
						onClick={() => fetchAssessment(true)}
						>
							Refresh assessment
						</button>
					</div>
				)}
			</div>
		</div>
	);
}