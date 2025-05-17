type Props = {
    prob: {
        value: string;
        raw: number;
        date: string;
        source: string;
    };
};

export default function RecessionProbability({ prob }: Props) {
    const riskLevel =
        prob.raw > 40 ? 'text-red-600'
            : prob.raw > 25 ? 'text-yellow-600'
                : 'text-green-600';

    return (
        <div className="p-4 border rounded-lg border-[var(--border-color)] bg-[var(--background)] shadow">
            <h3 className="font-semibold text-[var(--text-secondary)]">Recession Probability</h3>
            <p className={`text-2xl font-bold ${riskLevel}`}>{prob.value}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
                As of {prob.date.slice(0, 7)} ({prob.source})
            </p>
        </div>
    );
}
