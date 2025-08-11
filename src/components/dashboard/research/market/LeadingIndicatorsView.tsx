'use client';

import React from 'react';
import EconomicCalendar from './EconomicCalendar';

export default function LeadingIndicatorsView() {
  return (
    <section className="gap-6 grid grid-cols-1">
      <div className="bg-[var(--card-bg)] shadow p-6 rounded-xl text-[var(--text)]">
        <EconomicCalendar country="US" />
      </div>
    </section>
  );
}


