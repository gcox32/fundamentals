'use client';

import Modal from '@/src/components/common/Modal';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useState } from 'react';

type DataPoint = { date: string; value: number };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  charts: {
    title: string;
    data: DataPoint[];
  }[];
};

export default function MultiChartModal({ isOpen, onClose, charts }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  const activeChart = charts[activeTab];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Inflation & Rates Trends" maxWidth="800px">
      <div className="flex mb-4 border-[var(--border-color)] border-b">
        {charts.map((chart, idx) => (
          <button
            key={chart.title}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === idx
                ? 'text-[var(--text)] border-b-2 border-[var(--accent)]'
                : 'text-[var(--text-secondary)]'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {chart.title}
          </button>
        ))}
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeChart.data}>
            <CartesianGrid horizontal={true} vertical={false} stroke={isDarkMode ? "#404040" : "#f0f0f0"} />
            <XAxis dataKey="date" tickFormatter={(tick) => tick.slice(0, 7)} />
            <YAxis />
            <Tooltip
              formatter={(value: number) => value.toFixed(2)}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Modal>
  );
}
