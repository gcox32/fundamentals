import { CompanyOutlook } from '@/types/company';
import Tooltip from '@/components/common/Tooltip';
import { FiInfo } from 'react-icons/fi';

interface StyleDistributionProps {
    companyOutlooks: CompanyOutlook[];
    weights: Array<{
        ticker: string;
        weight: number;
    }>;
}

// Market cap thresholds in billions
const MARKET_CAP_THRESHOLDS = {
    SMALL: 10,    // < $10B
    MEDIUM: 50,  // $10B - $50B
    LARGE: 50    // > $50B
};

// Style thresholds based on common metrics
const STYLE_THRESHOLDS = {
    VALUE: {
        score: 0.4,  // Lower score = more value-oriented
    },
    BLEND: {
        score: 0.7,  // Middle range = blend
    },
    GROWTH: {
        score: 1.0   // Higher score = more growth-oriented
    }
};

type MarketCapCategory = 'SMALL' | 'MEDIUM' | 'LARGE';
type StyleCategory = 'VALUE' | 'BLEND' | 'GROWTH';

interface HeatMapCell {
    value: number;
    companies: Array<{
        symbol: string;
        weight: number;
    }>;
}

export default function StyleDistribution({ companyOutlooks, weights }: StyleDistributionProps) {
    // Calculate market cap category
    const getMarketCapCategory = (mktCap: number): MarketCapCategory => {
        const capInBillions = mktCap / 1e9;
        if (capInBillions < MARKET_CAP_THRESHOLDS.SMALL) return 'SMALL';
        if (capInBillions < MARKET_CAP_THRESHOLDS.MEDIUM) return 'MEDIUM';
        return 'LARGE';
    };

    // Calculate style category based on multiple valuation and growth/quality metrics
    const getStyleCategory = (companyOutlook: CompanyOutlook): StyleCategory => {
        const ratios = companyOutlook.ratios[0];
        if (!ratios) return 'BLEND'; // Default to blend if no ratios available

        // Normalize helpers: 0 -> value tilt, 1 -> growth tilt
        const normalizeLowerBetter = (value: number, min: number, max: number) => {
            const v = Math.max(min, Math.min(max, value));
            return (v - min) / (max - min);
        };
        const normalizeHigherBetter = (value: number, min: number, max: number) => {
            return 1 - normalizeLowerBetter(value, min, max);
        };

        // Candidate metrics (conditionally included if present)
        const metricCandidates: Array<{ score: number; weight: number }> = [];

        // Valuation (lower -> value)
        if (ratios.peRatioTTM) metricCandidates.push({ score: normalizeLowerBetter(ratios.peRatioTTM, 5, 50), weight: 0.25 });
        if (ratios.priceToBookRatioTTM) metricCandidates.push({ score: normalizeLowerBetter(ratios.priceToBookRatioTTM, 0.5, 5), weight: 0.15 });
        if (ratios.priceToSalesRatioTTM) metricCandidates.push({ score: normalizeLowerBetter(ratios.priceToSalesRatioTTM, 0.5, 10), weight: 0.1 });
        if (ratios.priceToFreeCashFlowsRatioTTM) metricCandidates.push({ score: normalizeLowerBetter(ratios.priceToFreeCashFlowsRatioTTM, 5, 30), weight: 0.15 });
        if (ratios.priceEarningsToGrowthRatioTTM) metricCandidates.push({ score: normalizeLowerBetter(ratios.priceEarningsToGrowthRatioTTM, 0.5, 2), weight: 0.2 });

        // Yield (higher -> value)
        if (ratios.dividendYielPercentageTTM) metricCandidates.push({ score: normalizeHigherBetter(ratios.dividendYielPercentageTTM, 0, 8), weight: 0.05 });

        // Profitability/Growth proxy (higher -> growth)
        if (ratios.returnOnEquityTTM) metricCandidates.push({ score: normalizeLowerBetter(ratios.returnOnEquityTTM, 0, 30), weight: 0.1 });

        if (metricCandidates.length === 0) return 'BLEND';

        // Normalize weights among available metrics
        const totalWeight = metricCandidates.reduce((sum, m) => sum + m.weight, 0);
        const totalScore = metricCandidates.reduce((acc, m) => acc + m.score * (m.weight / totalWeight), 0);

        // Classify based on total score
        if (totalScore <= STYLE_THRESHOLDS.VALUE.score) {
            return 'VALUE';
        }
        if (totalScore <= STYLE_THRESHOLDS.BLEND.score) {
            return 'BLEND';
        }
        return 'GROWTH';
    };

    // Initialize heat map data
    const heatMapData: Record<MarketCapCategory, Record<StyleCategory, HeatMapCell>> = {
        SMALL: { VALUE: { value: 0, companies: [] }, BLEND: { value: 0, companies: [] }, GROWTH: { value: 0, companies: [] } },
        MEDIUM: { VALUE: { value: 0, companies: [] }, BLEND: { value: 0, companies: [] }, GROWTH: { value: 0, companies: [] } },
        LARGE: { VALUE: { value: 0, companies: [] }, BLEND: { value: 0, companies: [] }, GROWTH: { value: 0, companies: [] } }
    };

    // Populate heat map data
    companyOutlooks.forEach(outlook => {
        const weight = weights.find(w => w.ticker === outlook.profile.symbol)?.weight || 0;
        if (weight === 0) return;

        const marketCap = getMarketCapCategory(outlook.profile.mktCap);
        const style = getStyleCategory(outlook);

        heatMapData[marketCap][style].value += weight;
        heatMapData[marketCap][style].companies.push({
            symbol: outlook.profile.symbol,
            weight
        });
    });

    // Find max value for color scaling
    const maxValue = Math.max(
        ...Object.values(heatMapData).flatMap(row =>
            Object.values(row).map(cell => cell.value)
        )
    );

    // Generate color based on value
    const getColor = (value: number) => {
        const intensity = Math.min(value / maxValue, 1);
        return `rgba(var(--active-accent-rgb), ${intensity * 0.8})`;
    };

    return (
        <div className="w-full sm:w-[40%] min-w-0 sm:min-w-[440px]">
            <h3 className="inline-flex items-center gap-2 mb-2 font-semibold text-[var(--text)] text-sm text-center">
                Style Distribution
                <Tooltip content={"Classification combines valuation (P/E, P/B, P/S, P/FCF, PEG), yield (Div%), and profitability (ROE). Metrics are normalized with caps and weighted; low scores tilt Value, high scores tilt Growth."}>
                    <FiInfo />
                </Tooltip>
            </h3>
            <div className="gap-0.5 grid grid-cols-4 mt-5 ml-0 sm:ml-[-120px] scale-[0.9] sm:scale-100 origin-top-left">
                {/* Header row */}
                <div className="col-span-1"></div>
                <div className="font-medium text-[var(--text)] text-xs text-center">VALUE</div>
                <div className="font-medium text-[var(--text)] text-xs text-center">BLEND</div>
                <div className="font-medium text-[var(--text)] text-xs text-center">GROWTH</div>

                {/* Data rows */}
                {(['LARGE', 'MEDIUM', 'SMALL'] as MarketCapCategory[]).map((marketCap) => (
                    <div key={marketCap} className="contents">
                        <div className="flex justify-center items-end mb-2 font-medium text-[10px] text-[var(--text)] sm:text-xs sm:-rotate-90 transform">
                            {marketCap}
                        </div>
                        {(['VALUE', 'BLEND', 'GROWTH'] as StyleCategory[]).map((style) => {
                            const cell = heatMapData[marketCap][style];
                            return (
                                <div
                                    key={`${marketCap}-${style}`}
                                    className="group relative"
                                >
                                    <div
                                        className={`aspect-square rounded-sm transition-all duration-100 ${cell.value > 0 ? "hover:scale-105 cursor-default" : "cursor-default"}`}
                                        style={{
                                            backgroundColor: getColor(cell.value),
                                            border: '1px solid var(--border-color)'
                                        }}
                                    >
                                        <div className="absolute inset-0 flex justify-center items-center font-medium text-[var(--text)] text-xs">
                                            {cell.value > 0 ? `${(cell.value).toFixed(0)}%` : ''}
                                        </div>
                                    </div>
                                    {/* Tooltip */}
                                    {cell.companies.length > 0 && (
                                        <div className="hidden group-hover:block z-10 absolute bg-[var(--card-bg)] shadow-lg p-2 border border-[var(--border-color)] rounded-md min-w-[150px]">
                                            <div className="text-[var(--text)] text-xs">
                                                {cell.companies.map(company => (
                                                    <div key={company.symbol} className="flex justify-between">
                                                        <span>{company.symbol}</span>
                                                        <span>{(company.weight).toFixed(0)}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
} 