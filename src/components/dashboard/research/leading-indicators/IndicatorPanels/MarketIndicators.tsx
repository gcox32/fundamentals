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

type DataPoint = { date: string; spread: number };
type YieldCurveData = {
  latest: DataPoint;
  trend: string;
  series: DataPoint[];
};

export default function MarketBasedIndicators({ data }: { data: YieldCurveData }) {
  const [showChart, setShowChart] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!showChart) {
      setShowChart(true);
    }
  };

  if (!data) {
    return (
      <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Market-Based Indicators</h2>
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </section>
    );
  }

  return (
    <VisibilityWrapper componentId="market-based">
      <section
        className="p-6 bg-[var(--card-bg)] rounded-lg shadow cursor-pointer hover:bg-[var(--background-hover)] transition"
        onClick={handleClick}
      >
        <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Market-Based Indicators</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)]">2Y / 10Y Spread</h3>
            <p className="text-lg font-bold text-[var(--text)]">{data.latest.spread} bps</p>
          </div>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-2">{data.trend}</p>

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
                  <CartesianGrid strokeDasharray="3 3" />
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
