'use client';

import { useState } from 'react';
import FearGreedModal from './FearGreedModal';
import { FiExternalLink } from 'react-icons/fi';

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
        <h3 className="mb-1 font-semibold text-[var(--text-secondary)]">Fear-Greed Index</h3>

        <p className={`text-3xl font-bold ${color}`}>{data.value}</p>

        <div className="mt-1 text-[var(--text-secondary)] text-xs">

          {data.previous && (
            <p className="mt-1 text-[var(--text-secondary)] text-xs">
              Prev Close: {data.previous.value} ({data.previous.valueText})
            </p>
          )}

          {data.lastUpdated && (
            <p className="mt-1 text-[var(--text-secondary)] text-xs">
              Updated: {new Date(data.lastUpdated).toLocaleDateString()}
            </p>
          )}

          <a 
          href={`https://www.cnn.com/markets/fear-and-greed/`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex justify-end items-center gap-1 mt-2 w-full text-[var(--text-secondary)] hover:text-[var(--text)] text-xs"
          >
            View on CNN
            <FiExternalLink className="w-3 h-3" />
          </a>
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
