'use client';

import React from 'react';

export default function SentimentView() {
  return (
    <section className="grid grid-cols-1 gap-6">
      <div className="bg-[var(--card-bg)] text-[var(--text)] rounded-xl p-6 shadow">
        <h3 className="text-xl font-bold mb-2">Market Sentiment</h3>
        <p className="text-[var(--text-secondary)]">Placeholder for sentiment indices, breadth, and positioning.</p>
      </div>
    </section>
  );
}


