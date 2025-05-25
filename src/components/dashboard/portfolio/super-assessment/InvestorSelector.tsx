import { SUPER_INVESTORS } from "./config";

export default function InvestorSelector({ selectedInvestor, setSelectedInvestor }: { selectedInvestor: string | null, setSelectedInvestor: (investor: string) => void }) {
	return (
        <div className="flex flex-wrap gap-4 mb-6">
        {SUPER_INVESTORS.map((investor) => (
            <button
                key={investor.id}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200
                    ${selectedInvestor === investor.id
                        ? 'bg-[var(--active-accent)] text-white border-[var(--active-accent)]'
                        : 'bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] text-[var(--text)] border-[var(--border-color)]'
                    }`}
                onClick={() => setSelectedInvestor(investor.id)}
            >
                {investor.name}
            </button>
        ))}
    </div>
	);
}