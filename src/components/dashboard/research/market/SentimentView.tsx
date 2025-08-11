'use client';

import React from 'react';

export default function SentimentView() {
  return (
    <section className="gap-6 grid grid-cols-1">
      <div className="bg-[var(--card-bg)] shadow p-6 rounded-xl text-[var(--text)]">
        <h3 className="mb-2 font-bold text-xl">Market Sentiment</h3>
        <p className="text-[var(--text-secondary)]">Placeholder for sentiment indices, breadth, and positioning.</p>
      </div>
    </section>
  );
}


