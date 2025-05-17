type Props = {
    status: {
        value: string;
        basis: string;
        raw?: number;
        date?: string;
        source?: string;
    };
};

export default function EconomicStatusCard({ status }: Props) {
    const color =
        status.value === 'Expansion' ? 'text-green-600' :
            status.value === 'Contraction' ? 'text-red-600' :
                status.value === 'Stagnation' ? 'text-yellow-600' :
                    'text-orange-600';

    return (
        <div className="p-4 border rounded-lg border-[var(--border-color)] bg-[var(--background)] shadow">
            <h3 className="font-semibold text-[var(--text-secondary)]">Economic Status</h3>
            <p className={`text-2xl font-bold ${color}`}>{status.value}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{status.basis}</p>
        </div>
    );
}
