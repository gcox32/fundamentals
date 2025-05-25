import { useState } from 'react';
import ChartModal from '@/components/dashboard/research/leading-indicators/common/ChartModal';

type Props = {
  trend: string;
  series: {
    mom: { date: string; value: number }[];
    yoy: { date: string; value: number }[];
  };
};

export default function InflationRegime({ trend, series }: Props) {
  const [showChart, setShowChart] = useState(false);
  const [mode, setMode] = useState<'mom' | 'yoy'>('yoy');
  const lastUpdated = series.mom[series.mom.length - 1].date;
  ;
  const handleClick = (e: React.MouseEvent) => {
    // Only set showChart to true if we're clicking the card itself
    if (!showChart) {
      setShowChart(true);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 border rounded-lg bg-[var(--card-bg)] border-[var(--border-color)] shadow cursor-pointer hover:bg-[var(--background-hover)] transition"
    >
      <h3 className="font-semibold text-[var(--text-secondary)]">Inflation Regime</h3>
      <p className="text-2xl font-bold text-[var(--text)]">{trend}</p>
      <p className="text-sm text-[var(--text-secondary)] mt-2 float-right">Last Updated: {lastUpdated}</p>
      {showChart && (
        <ChartModal
          title={`CPI (${mode.toUpperCase()})`}
          data={series[mode]}
          mode={mode}
          onToggleMode={() => setMode(prev => (prev === 'yoy' ? 'mom' : 'yoy'))}
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  );
}
