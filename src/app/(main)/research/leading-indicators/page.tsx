'use client';

import HeaderOverview from "@/src/components/dashboard/research/leading-indicators/HeaderOverview";
import RegimeSummary from "@/src/components/dashboard/research/leading-indicators/RegimeSummary";
import { 
  ConsumerHealth, 
  BusinessHealth, 
  InflationRates 
} from "@/src/components/dashboard/research/leading-indicators/IndicatorPanels";
import CreditMarkets from "@/src/components/dashboard/research/leading-indicators/IndicatorPanels/CreditMarkets";
import MarketIndicators from "@/src/components/dashboard/research/leading-indicators/IndicatorPanels/MarketIndicators";

export default function LeadingIndicators() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeaderOverview />

      <RegimeSummary />

      {/* Thematic Indicator Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Consumer Health */}
        <ConsumerHealth />

        {/* Business Health */}
        <BusinessHealth />

        {/* Inflation & Rates */}
        <InflationRates />

        {/* Credit Markets */}
        <CreditMarkets />

        {/* Market-Based Indicators */}
        <MarketIndicators />

      </div>

      {/* Sector Impact & Valuation Implications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Sector Impact Snapshot</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border-b border-[var(--border-color)]">
              <span className="text-[var(--text)]">Technology</span>
              <span className="text-green-600">🔺 Favorable</span>
            </div>
            <div className="flex items-center justify-between p-2 border-b border-[var(--border-color)]">
              <span className="text-[var(--text)]">Industrials</span>
              <span className="text-yellow-600">⚠️ Mixed</span>
            </div>
            <div className="flex items-center justify-between p-2 border-b border-[var(--border-color)]">
              <span className="text-[var(--text)]">Consumer Staples</span>
              <span className="text-red-600">🔻 Unfavorable</span>
            </div>
          </div>
        </section>

        <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Valuation Implications</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
              <h3 className="font-semibold mb-2 text-[var(--text)]">Multiple Compression Risk</h3>
              <p className="text-[var(--text-secondary)]">{`P/E multiples typically compress when CPI > 4% and rates are restrictive`}</p>
            </div>
            <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
              <h3 className="font-semibold mb-2 text-[var(--text)]">Growth Expectations</h3>
              <p className="text-[var(--text-secondary)]">{`Leading indicators suggest moderate earnings growth potential`}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 