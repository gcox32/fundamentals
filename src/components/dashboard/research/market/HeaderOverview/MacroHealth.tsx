type MacroComposite = {
  score: number;
  regime: string;
  tilt: 'Positive' | 'Neutral' | 'Cautious';
  drivers: string[];
  asOf: string;
};

export default function MacroHealth({ composite, fallbackStatus }: { composite?: MacroComposite | null, fallbackStatus: { value: string; basis: string } }) {
  if (!composite) {
    return (
      <div className="p-4 border rounded-lg border-[var(--border-color)] bg-[var(--background)] shadow">
        <h3 className="font-semibold text-[var(--text-secondary)]">Macro Health & Nowcast</h3>
        <p className="text-2xl font-bold">{fallbackStatus.value}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">{fallbackStatus.basis}</p>
      </div>
    );
  }

  const color =
    composite.score >= 70 ? 'text-green-600' :
      composite.score >= 50 ? 'text-yellow-600' :
        composite.score >= 30 ? 'text-orange-600' :
          'text-red-600';

  return (
    <div className="p-4 border rounded-lg border-[var(--border-color)] bg-[var(--background)] shadow">
      <h3 className="font-semibold text-[var(--text-secondary)]">Macro Health & Nowcast</h3>

      <div className="flex items-baseline gap-2">
        <p className={`text-3xl font-bold ${color}`}>{composite.score}/100</p>
        <span className="text-sm text-[var(--text-secondary)]">Regime: {composite.regime}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <span className="px-2 py-1 text-xs rounded bg-[var(--card-bg)] border border-[var(--border-color)]">Tilt: {composite.tilt}</span>
        {composite.drivers.slice(0, 3).map((d, i) => (
          <span key={i} className="px-2 py-1 text-xs rounded bg-[var(--card-bg)] border border-[var(--border-color)]">{d}</span>
        ))}
      </div>

      <p className="mt-2 text-[var(--text-secondary)] text-xs">Updated: {new Date(composite.asOf).toLocaleDateString()}</p>
    </div>
  );
}


