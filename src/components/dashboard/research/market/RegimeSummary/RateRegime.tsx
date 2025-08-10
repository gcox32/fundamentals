import { useState } from 'react';
import ChartModal from '@/components/dashboard/research/market/common/ChartModal';

type Props = {
	trend: string;
	series: { date: string; value: number }[];
};

export default function RateRegime({ trend, series }: Props) {
	const [showChart, setShowChart] = useState(false);
	const lastUpdated = series[series.length - 1].date;
	const handleClick = (e: React.MouseEvent) => {
		if (!showChart) {
			setShowChart(true);
		}
	};

	return (
		<div
			onClick={handleClick}
			className="p-4 border rounded-lg bg-[var(--card-bg)] border-[var(--border-color)] shadow cursor-pointer hover:bg-[var(--background-hover)] transition"
		>
			<h3 className="font-semibold text-[var(--text-secondary)]">Rate Regime</h3>
			<p className="text-2xl font-bold text-[var(--text)]">{trend}</p>
			<p className="text-sm text-[var(--text-secondary)] mt-2 float-right">Last Updated: {lastUpdated}</p>
			{showChart && (
				<ChartModal
					title="Fed Funds Rate"
					data={series}
					onClose={() => setShowChart(false)}
				/>
			)}
		</div>
	);
}
