'use client';

import { useState } from 'react';
import FearGreedModal from './FearGreedModal';

export interface FearGreedIndexData {
  data: {
  value: string;
  previous?: { value: number; valueText: string };
  oneWeekAgo?: { value: number; valueText: string };
  oneMonthAgo?: { value: number; valueText: string };
  oneYearAgo?: { value: number; valueText: string };
    lastUpdated?: string;
  };
};

export default function FearGreedIndexCard({ data }: FearGreedIndexData) {
  const [showModal, setShowModal] = useState(false);
  const [score, label] = data.value.split(' - ');
  const num = parseInt(score);

  const color =
    num >= 75 ? 'text-green-600' :
    num >= 50 ? 'text-yellow-600' :
    num >= 25 ? 'text-orange-600' :
    'text-red-600';

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="p-4 border rounded-lg border-[var(--border-color)] bg-[var(--background)] shadow cursor-pointer hover:bg-[var(--background-hover)] transition"
      >
        <h3 className="font-semibold text-[var(--text-secondary)]">Fear-Greed Index</h3>
        <p className={`text-2xl font-bold ${color}`}>{data.value}</p>
        <div className="text-xs text-[var(--text-secondary)] mt-1 space-y-1">
          {data.previous && (
            <p>
              Prev Close: {data.previous.value} ({data.previous.valueText})
            </p>
          )}
          {data.lastUpdated && (
            <p>Updated: {new Date(data.lastUpdated).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      <FearGreedModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={data}
      />
    </>
  );
}
