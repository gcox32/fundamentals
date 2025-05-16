import EconomicStatus from "./EconomicStatus";
import FearGreedIndex from "./FearGreedIndex";
import RecessionProbability from "./RecessionProbability";

export default function HeaderOverview() {
    return (
        <section className="mb-8 p-6 bg-[var(--card-bg)] rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Macroeconomic Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EconomicStatus />
                <FearGreedIndex />
                <RecessionProbability />
            </div>
        </section>
    );
}