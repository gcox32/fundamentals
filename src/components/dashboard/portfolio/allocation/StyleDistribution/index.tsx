import { CompanyOutlook } from '@/types/company';

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
        peRatio: 15,
        pbRatio: 1.5
    },
    BLEND: {
        peRatio: 25,
        pbRatio: 2.5
    },
    GROWTH: {
        peRatio: Infinity,
        pbRatio: Infinity
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

    // Calculate style category based on P/E and P/B ratios
    const getStyleCategory = (companyOutlook: CompanyOutlook): StyleCategory => {
        // For simplicity, we'll use a basic classification
        // In a real application, you might want to use more sophisticated metrics
        const peRatio = companyOutlook.ratios[0]?.peRatioTTM || 0;
        const pbRatio = companyOutlook.ratios[0]?.priceToBookRatioTTM || 0;
        if (peRatio <= STYLE_THRESHOLDS.VALUE.peRatio) {
            return 'VALUE';
        }
        if (peRatio <= STYLE_THRESHOLDS.BLEND.peRatio) {
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
        <div className="w-[40%] min-w-[440px]">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-2 text-center">Style Distribution</h3>
            <div className="grid grid-cols-4 gap-0.5 mt-5 ml-[-120px]">
                {/* Header row */}
                <div className="col-span-1"></div>
                <div className="text-center text-[var(--text)] text-xs font-medium">VALUE</div>
                <div className="text-center text-[var(--text)] text-xs font-medium">BLEND</div>
                <div className="text-center text-[var(--text)] text-xs font-medium">GROWTH</div>

                {/* Data rows */}
                {(['LARGE', 'MEDIUM', 'SMALL'] as MarketCapCategory[]).map((marketCap) => (
                    <div key={marketCap} className="contents">
                        <div className="flex items-end justify-center mb-2 transform -rotate-90 text-[var(--text)] text-xs font-medium">
                            {marketCap}
                        </div>
                        {(['VALUE', 'BLEND', 'GROWTH'] as StyleCategory[]).map((style) => {
                            const cell = heatMapData[marketCap][style];
                            return (
                                <div
                                    key={`${marketCap}-${style}`}
                                    className="relative group"
                                >
                                    <div
                                        className={`aspect-square rounded-sm transition-all duration-100 ${cell.value > 0 ? "hover:scale-105 cursor-default" : "cursor-default"}`}
                                        style={{
                                            backgroundColor: getColor(cell.value),
                                            border: '1px solid var(--border-color)'
                                        }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center text-[var(--text)] text-xs font-medium">
                                            {cell.value > 0 ? `${(cell.value).toFixed(0)}%` : ''}
                                        </div>
                                    </div>
                                    {/* Tooltip */}
                                    {cell.companies.length > 0 && (
                                        <div className="absolute z-10 hidden group-hover:block bg-[var(--card-bg)] border border-[var(--border-color)] rounded-md p-2 shadow-lg min-w-[150px]">
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