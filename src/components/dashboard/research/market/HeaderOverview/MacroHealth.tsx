"use client";

import { useEffect, useState } from 'react';

type MacroComposite = {
  score: number;
  regime: string;
  tilt: 'Positive' | 'Neutral' | 'Cautious';
  drivers: string[];
  asOf: string;
};

type PolicyStanceData = {
  latest: { value: number; date: string };
  trend: 'Restrictive' | 'Neutral' | 'Accommodative' | string;
};

export default function MacroHealth({ composite, fallbackStatus }: { composite?: MacroComposite | null, fallbackStatus: { value: string; basis: string } }) {
  const [policy, setPolicy] = useState<PolicyStanceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/research/fred/FEDFUNDS')
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to load policy stance')))
      .then((data) => { if (isMounted) setPolicy(data); })
      .catch((e) => { if (isMounted) setError(e.message); });
    return () => { isMounted = false; };
  }, []);

  // While loading or on error, show the simple economic status fallback to keep the header clean
  if (!policy || error) {
    return (
      <div className="bg-[var(--background)] shadow p-4 border border-[var(--border-color)] rounded-lg">
        <h3 className="font-semibold text-[var(--text-secondary)]">Policy Stance</h3>
        <p className="font-bold text-2xl">{fallbackStatus.value}</p>
        <p className="mt-1 text-[var(--text-secondary)] text-xs">{fallbackStatus.basis}</p>
      </div>
    );
  }

  const color =
    policy.trend === 'Accommodative' ? 'text-green-600' :
      policy.trend === 'Neutral' ? 'text-yellow-600' :
        'text-red-600';

  return (
    <div className="bg-[var(--background)] shadow p-4 border border-[var(--border-color)] rounded-lg">
      <h3 className="font-semibold text-[var(--text-secondary)]">Policy Stance (Fed Funds)</h3>

      <div className="flex items-baseline gap-2">
        <p className={`text-3xl font-bold ${color}`}>{policy.trend}</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <span className="bg-[var(--card-bg)] px-2 py-1 border border-[var(--border-color)] rounded text-xs">
          {`${policy.latest.value.toFixed(2)}% effective rate`}
        </span>
      </div>

      <p className="mt-2 text-[var(--text-secondary)] text-xs">Updated: {new Date(policy.latest.date).toLocaleDateString()}</p>
    </div>
  );
}


