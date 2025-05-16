'use client';

import { useEffect, useState } from 'react';
import InflationRegime from './InflationRegime';
import RateRegime from './RateRegime';
import ConsumerSentiment from './ConsumerSentiment';

type TimeSeriesPoint = { date: string; value: number };

type RegimeSummaryData = {
  cpi: {
    latest: number;
    trend: string;
    series: {
      mom: TimeSeriesPoint[];
      yoy: TimeSeriesPoint[];
    };
  };
  rate: {
    latest: string;
    trend: string;
    series: TimeSeriesPoint[];
  };
  sentiment: {
    latest: number;
    trend: string;
    series: TimeSeriesPoint[];
  };
};

export default function RegimeSummary() {
  const [data, setData] = useState<RegimeSummaryData | null>(null);

  useEffect(() => {
    fetch('/api/research/leading-indicators/regime-summary')
      .then((res) => res.json())
      .then((resData) => setData({
        cpi: resData.cpi,
        rate: resData.rate,
        sentiment: resData.sentiment
      }));
  }, []);

  if (!data) {
    return (
      <div className="text-[var(--text-secondary)]">Loading regime summary...</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <InflationRegime trend={data.cpi.trend} series={data.cpi.series} />
      <RateRegime trend={data.rate.trend} series={data.rate.series} />
      <ConsumerSentiment trend={data.sentiment.trend} series={data.sentiment.series} />
    </div>
  );
}
