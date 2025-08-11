'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';

type EconomicEvent = {
  date: string;
  country: string;
  event: string;
  currency: string | null;
  previous: number | null;
  estimate: number | null;
  actual: number | null;
  change: number | null;
  impact: string | null;
  changePercentage: number | null;
  unit: string | null;
};

type Props = {
  country?: string; // defaults to US
  impact?: string; // optional exact match
};

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeekSunday(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  return addDays(d, -day);
}

function formatTime(dateStr: string): string {
  try {
    const d = new Date(dateStr.replace(' ', 'T'));
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function impactClass(impact: string | null | undefined): string {
  const val = (impact || '').toLowerCase();
  if (val === 'high') return styles.impactHigh;
  if (val === 'medium') return styles.impactMedium;
  if (val === 'low') return styles.impactLow;
  return styles.impactNone;
}

export default function EconomicCalendar({ country = 'US', impact }: Props) {
  const rangeStart = useMemo(() => addDays(startOfWeekSunday(new Date()), -7), []);
  const rangeEnd = useMemo(() => addDays(rangeStart, 27), [rangeStart]);

  const from = useMemo(() => toDateKey(rangeStart), [rangeStart]);
  const to = useMemo(() => toDateKey(rangeEnd), [rangeEnd]);

  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    const q = new URLSearchParams({ from, to, country });
    if (impact) q.set('impact', impact);
    q.set('limit', '2000');
    return q.toString();
  }, [from, to, country, impact]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/research/market/economic-calendar?${query}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = (await res.json()) as EconomicEvent[];
        if (isMounted) setEvents(data);
      } catch (e) {
        if (isMounted) setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [query]);

  const days = useMemo(() => {
    const out: { date: Date; dateKey: string }[] = [];
    for (let i = 0; i < 28; i++) {
      const date = addDays(rangeStart, i);
      out.push({ date, dateKey: toDateKey(date) });
    }
    return out;
  }, [rangeStart]);

  const eventsByDate = useMemo(() => {
    const map = new Map<
      string,
      {
        items: EconomicEvent[];
        counts: { high: number; medium: number; low: number; none: number };
      }
    >();
    for (const ev of events) {
      const dateKey = ev.date.slice(0, 10);
      if (!map.has(dateKey)) {
        map.set(dateKey, { items: [], counts: { high: 0, medium: 0, low: 0, none: 0 } });
      }
      const bucket = map.get(dateKey)!;
      bucket.items.push(ev);
      const key = (ev.impact || 'none').toLowerCase() as 'high' | 'medium' | 'low' | 'none';
      bucket.counts[key] += 1;
    }
    // sort events within day by time then by impact (for future expansion views)
    for (const [, value] of map.entries()) {
      value.items.sort((a, b) => {
        const at = new Date(a.date.replace(' ', 'T')).getTime();
        const bt = new Date(b.date.replace(' ', 'T')).getTime();
        if (at !== bt) return at - bt;
        const order = { high: 0, medium: 1, low: 2, none: 3 } as const;
        const ai = order[(a.impact || 'none').toLowerCase() as keyof typeof order] ?? 3;
        const bi = order[(b.impact || 'none').toLowerCase() as keyof typeof order] ?? 3;
        return ai - bi;
      });
    }
    return map;
  }, [events]);

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Overlay state
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [overlayRect, setOverlayRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [expandedDateKey, setExpandedDateKey] = useState<string | null>(null);

  useLayoutEffect(() => {
    const onResize = () => {
      if (!expandedDateKey) return;
      if (!wrapperRef.current || !gridRef.current) return;
      const cell = gridRef.current.querySelector<HTMLDivElement>(`[data-date-key="${expandedDateKey}"]`);
      if (!cell) return;

      const gridBox = gridRef.current.getBoundingClientRect();
      const cellBox = cell.getBoundingClientRect();
      const left = cellBox.left - gridBox.left;
      const top = cellBox.top - gridBox.top;
      setOverlayRect({ left, top, width: cellBox.width, height: cellBox.height });
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [expandedDateKey]);

  const openOverlay = (dateKey: string) => {
    if (!gridRef.current) return;
    const cell = gridRef.current.querySelector<HTMLDivElement>(`[data-date-key="${dateKey}"]`);
    if (!cell) return;
    const gridBox = gridRef.current.getBoundingClientRect();
    const cellBox = cell.getBoundingClientRect();
    const left = cellBox.left - gridBox.left;
    const top = cellBox.top - gridBox.top;
    setOverlayRect({ left, top, width: cellBox.width, height: cellBox.height });
    setExpandedDateKey(dateKey);
    // next frame expand to full grid
    requestAnimationFrame(() => {
      const full = { left: 0, top: 0, width: gridBox.width, height: gridBox.height + 64 };
      setOverlayRect(full);
    });
  };

  const closeOverlay = () => {
    if (!expandedDateKey || !gridRef.current) {
      setExpandedDateKey(null);
      setOverlayRect(null);
      return;
    }
    const cell = gridRef.current.querySelector<HTMLDivElement>(`[data-date-key="${expandedDateKey}"]`);
    const gridBox = gridRef.current.getBoundingClientRect();
    if (!cell) {
      setExpandedDateKey(null);
      setOverlayRect(null);
      return;
    }
    const cellBox = cell.getBoundingClientRect();
    const left = cellBox.left - gridBox.left;
    const top = cellBox.top - gridBox.top;
    setOverlayRect({ left, top, width: cellBox.width, height: cellBox.height });
    // after transition end, clear state
    setTimeout(() => {
      setExpandedDateKey(null);
      setOverlayRect(null);
    }, 240);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.header}>
        <div className={styles.rangeText}>
          {rangeStart.toLocaleDateString()} – {rangeEnd.toLocaleDateString()} ({country})
        </div>
        {loading && <div className={styles.loading}>Loading…</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>

      <div className={styles.weekdays}>
        {weekdayLabels.map((lbl) => (
          <div key={lbl} className={styles.weekday}>
            {lbl}
          </div>
        ))}
      </div>

      <div className={styles.grid} ref={gridRef}>
        {days.map(({ date, dateKey }) => {
          const dayData = eventsByDate.get(dateKey);
          const counts = dayData?.counts || { high: 0, medium: 0, low: 0, none: 0 };
          const isToday = toDateKey(startOfDay(new Date())) === dateKey;
          return (
            <div key={dateKey} data-date-key={dateKey} className={`${styles.cell} ${isToday ? styles.today : ''}`} onClick={() => openOverlay(dateKey)}>
              <div className={styles.dateHeader}>
                <span className={styles.dateNumber}>{date.getDate()}</span>
                <span className={styles.dateMeta}>{date.toLocaleDateString(undefined, { month: 'short' })}</span>
              </div>
              <div className={styles.events}>
                {counts.high + counts.medium + counts.low + counts.none === 0 ? (
                  <div className={styles.noEvent}>—</div>
                ) : (
                  <>
                    {counts.high > 0 && (
                      <span className={`${styles.pill} ${styles.impactHigh}`} title="High impact events">
                        <span className={styles.pillCount}>{counts.high}</span>
                      </span>
                    )}
                    {counts.medium > 0 && (
                      <span className={`${styles.pill} ${styles.impactMedium}`} title="Medium impact events">
                        <span className={styles.pillCount}>{counts.medium}</span>
                      </span>
                    )}
                    {counts.low > 0 && (
                      <span className={`${styles.pill} ${styles.impactLow}`} title="Low impact events">
                        <span className={styles.pillCount}>{counts.low}</span>
                      </span>
                    )}
                    {counts.none > 0 && (
                      <span className={`${styles.pill} ${styles.impactNone}`} title="No impact events">
                        <span className={styles.pillCount}>{counts.none}</span>
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {expandedDateKey && overlayRect && (
        <div
          className={styles.overlay}
          style={{ left: overlayRect.left, top: overlayRect.top, width: overlayRect.width, height: overlayRect.height }}
        >
          <div className={styles.overlayInner}>
            <div className={styles.overlayHeader}>
              <div className={styles.overlayTitle}>
                {expandedDateKey} — {weekdayLabels[new Date(expandedDateKey).getDay()]}
              </div>
              <button className={styles.closeBtn} onClick={closeOverlay}>Close</button>
            </div>
            <div className={styles.overlayBody}>
              {(eventsByDate.get(expandedDateKey)?.items || []).map((ev, idx) => (
                <div key={`${ev.event}-${idx}`} className={`${styles.overlayBadge} ${impactClass(ev.impact)}`}>
                  <div>{ev.event}</div>
                  <div className={styles.overlayMeta}>
                    {formatTime(ev.date)} · Impact: {ev.impact || 'N/A'} · Prev: {ev.previous ?? '—'} · Est: {ev.estimate ?? '—'} · Act: {ev.actual ?? '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




