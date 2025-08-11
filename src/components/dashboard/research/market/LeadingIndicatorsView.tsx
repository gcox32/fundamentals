'use client';

import React from 'react';
import EconomicCalendar from './EconomicCalendar';

export default function LeadingIndicatorsView() {
  return (
    <section className="gap-6 grid grid-cols-1">
      <div className="bg-[var(--card-bg)] shadow p-6 rounded-xl text-[var(--text)]">
        <h3 className="mb-4 font-bold text-xl">Leading Indicators</h3>
        <p className="mb-4 text-[var(--text-secondary)]">Composite economic panels, regime summary, and calendar of key macro events.</p>
        <EconomicCalendar country="US" />
      </div>
    </section>
  );
}


