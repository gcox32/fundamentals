type Props = {
    data: {
        value: string;
        previous?: { value: number; valueText: string };
        oneWeekAgo?: { value: number; valueText: string };
        oneMonthAgo?: { value: number; valueText: string };
        oneYearAgo?: { value: number; valueText: string };
        lastUpdated?: string;
    };
  };
  
  export default function FearGreedIndexCard({ data }: Props) {
    const score = parseInt(data.value.split(' ')[0]);
    const color =
      score >= 75 ? 'text-green-600' :
      score >= 50 ? 'text-yellow-600' :
      score >= 25 ? 'text-orange-600' :
      'text-red-600';
  
    return (
      <div className="p-4 border rounded-lg border-[var(--border-color)] bg-[var(--background)] shadow">
        <h3 className="font-semibold text-[var(--text-secondary)]">Fear-Greed Index</h3>
        <p className={`text-2xl font-bold ${color}`}>{data.value}</p>
        <div className="text-xs text-[var(--text-secondary)] mt-1 space-y-1">
          {data.previous && <p>Prev Close: {data.previous.value} ({data.previous.valueText})</p>}
          {data.lastUpdated && <p>Updated: {new Date(data.lastUpdated).toLocaleDateString()}</p>}
        </div>
      </div>
    );
  }
  