'use client';

import { useEffect, useState } from 'react';
import MacroHealth from "./MacroHealth";
import FearGreedIndex from "./FearGreedIndex";
import RecessionProbability from "./RecessionProbability";
import { ParsedMarket } from '@/types/polymarket';

type MacroComposite = {
  score: number;
  regime: string;
  tilt: 'Positive' | 'Neutral' | 'Cautious';
  drivers: string[];
  asOf: string;
};

type HeaderOverviewData = {
  economicStatus: {
    value: string;
    basis: string;
  };
  fearGreed: {
    value: string;
  };
  recessionMarket: ParsedMarket;
  macroComposite?: MacroComposite | null;
};

export default function HeaderOverview() {
  const [data, setData] = useState<HeaderOverviewData | null>(null);
  
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
        <MacroHealth composite={data.macroComposite} fallbackStatus={data.economicStatus} />
        <FearGreedIndex data={data.fearGreed} />
        <RecessionProbability parsedMarket={data.recessionMarket} />
      </div>
    </section>
  );
}
