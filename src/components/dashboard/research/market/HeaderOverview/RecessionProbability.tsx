import { ParsedMarket } from "@/types/polymarket";
import { FiExternalLink } from "react-icons/fi";

export default function RecessionProbability({ parsedMarket }: { parsedMarket: ParsedMarket }) {
    console.log(parsedMarket);
    const prob = parsedMarket.yesPrice * 100;
    const riskLevel =
        prob > 40 ? 'text-red-600'
            : prob > 25 ? 'text-yellow-600'
                : 'text-green-600';

    const shortTitle = parsedMarket.question.length > 40
        ? parsedMarket.question.slice(0, 37) + "..."
        : parsedMarket.question;

    const confidence =
        parsedMarket.liquidity > 10000 ? "High"
        : parsedMarket.liquidity > 3000 ? "Moderate"
        : "Low";

    return (
        <div className="bg-[var(--background)] shadow p-4 border border-[var(--border-color)] rounded-lg">
            <h3 className="mb-1 font-semibold text-[var(--text-secondary)]">
                US Recession Risk
            </h3>

            <p className={`text-3xl font-bold ${riskLevel}`}>
                {prob.toFixed(1)}%
            </p>

            <p className="mt-1 text-[var(--text-secondary)] text-xs">
                Confidence: {confidence}
            </p>

            <p className="mt-1 text-[var(--text-secondary)] text-xs">
                Updated: {new Date(parsedMarket.updatedAt).toLocaleDateString()}
            </p>

            <a 
                href={`https://polymarket.com/event/${parsedMarket.slug}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex justify-end items-center gap-1 mt-2 w-full text-[var(--text-secondary)] hover:text-[var(--text)] text-xs"
            >
                View on Polymarket
                <FiExternalLink className="w-3 h-3" />
            </a>
        </div>
    );
}
