'use client';

import VisibilityWrapper from "../../valuation/VisibilityWrapper";
import Modal from "@/src/components/common/Modal";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useEffect, useState } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';

type DataPoint = { date: string; spread: number };
type YieldCurveData = {
  latest: DataPoint;
  trend: string;
  series: DataPoint[];
};

export default function MarketBasedIndicators({ data }: { data: YieldCurveData }) {
  const [showChart, setShowChart] = useState(false);
  const { isDarkMode } = useTheme();
  const handleClick = (e: React.MouseEvent) => {
    if (!showChart) {
      setShowChart(true);
    }
  };

  if (!data) {
    return (
      <section className="bg-[var(--card-bg)] shadow p-6 rounded-lg">
        <h2 className="mb-4 font-bold text-[var(--text)] text-xl">Market-Based Indicators</h2>
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </section>
    );
  }

  return (
    <VisibilityWrapper componentId="market-based">
      <section
        className="bg-[var(--card-bg)] hover:bg-[var(--background-hover)] shadow p-6 rounded-lg transition cursor-pointer"
        onClick={handleClick}
      >
        <h2 className="mb-4 font-bold text-[var(--text)] text-xl">Market-Based Indicators</h2>
        <div className="gap-4 grid grid-cols-2">
          <div>
            <h3 className="font-semibold text-[var(--text-secondary)] text-sm">2Y / 10Y Spread</h3>
            <p className="font-bold text-[var(--text)] text-lg">{data.latest.spread} bps</p>
          </div>
        </div>
        <p className="mt-2 text-[var(--text-secondary)] text-sm">{data.trend}</p>

        {showChart && (
          <Modal
            isOpen={showChart}
            onClose={() => setShowChart(false)}
            title="Yield Curve Spread (2Y - 10Y)"
            maxWidth="800px"
          >
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.series}>
                  <CartesianGrid horizontal={true} vertical={false} stroke={isDarkMode ? "#404040" : "#f0f0f0"} />
                  <XAxis dataKey="date" tickFormatter={(d) => d.slice(0, 7)} />
                  <YAxis domain={['dataMin', 'dataMax']} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="spread"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Modal>
        )}
      </section>
    </VisibilityWrapper>
  );
}
