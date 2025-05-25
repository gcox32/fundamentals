'use client';

import { useEffect, useState } from 'react';
import EconomicStatus from "./EconomicStatus";
import FearGreedIndex from "./FearGreedIndex";
import RecessionProbability from "./RecessionProbability";

type RecessionProb = {
  value: string;
  raw: number;
  date: string;
  source: string;
};

type HeaderOverviewData = {
  economicStatus: {
    value: string;
    basis: string;
  };
  fearGreed: {
    value: string;
  };
  recessionProb: RecessionProb;
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
      <section className="mb-8 p-6 bg-[var(--card-bg)] rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Macroeconomic Overview</h2>
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </section>
    );
  }

  return (
    <section className="mb-8 p-6 bg-[var(--card-bg)] rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Macroeconomic Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EconomicStatus status={data.economicStatus} />
        <FearGreedIndex data={data.fearGreed} />
        <RecessionProbability prob={data.recessionProb} />
      </div>
    </section>
  );
}
