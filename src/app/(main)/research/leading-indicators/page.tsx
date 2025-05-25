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
import { useState, useEffect } from "react";

export default function LeadingIndicators() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch('/api/research/composite')
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeaderOverview />

      <RegimeSummary />

      {/* Thematic Indicator Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Consumer Health */}
        <ConsumerHealth data={data?.consumerHealth} />

        {/* Business Health */}
        <BusinessHealth data={data?.businessHealth} />

        {/* Inflation & Rates */}
        <InflationRates data={data?.inflationRates} />

        {/* Credit Markets */}
        <CreditMarkets data={data?.creditMarkets} />

        {/* Market-Based Indicators */}
        <MarketIndicators data={data?.marketIndicators} />

      </div>

    </main>
  );
} 