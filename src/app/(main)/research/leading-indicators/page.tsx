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

    </main>
  );
} 