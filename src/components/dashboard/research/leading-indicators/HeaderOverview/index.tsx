'use client';

import { useEffect, useState } from 'react';
import EconomicStatus from "./EconomicStatus";
import FearGreedIndex from "./FearGreedIndex";
import RecessionProbability from "./RecessionProbability";
import { ParsedMarket } from '@/types/polymarket';

type HeaderOverviewData = {
  economicStatus: {
    value: string;
    basis: string;
  };
  fearGreed: {
    value: string;
  };
  recessionMarket: ParsedMarket;
};

export default function HeaderOverview() {
  const [data, setData] = useState<HeaderOverviewData | null>(null);
  console.log(data);
  useEffect(() => {
    fetch('/api/research/composite/header-overview')
      .then(res => res.json())
      .then(setData)
  }, []);

  if (!data) {
    return (
      <section className="bg-[var(--card-bg)] shadow mb-8 p-6 rounded-lg">
        <h2 className="mb-4 font-bold text-[var(--text)] text-2xl">Macroeconomic Overview</h2>
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </section>
    );
  }

  return (
    <section className="bg-[var(--card-bg)] shadow mb-8 p-6 rounded-lg">
      <h2 className="mb-4 font-bold text-[var(--text)] text-2xl">Macroeconomic Overview</h2>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        <EconomicStatus status={data.economicStatus} />
        <FearGreedIndex data={data.fearGreed} />
        <RecessionProbability parsedMarket={data.recessionMarket} />
      </div>
    </section>
  );
}
