'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.css';

type EventType = 'Earnings' | 'Dividend' | 'Ex-Dividend';

interface CompanyCalendarEvents {
  symbol: string;
  nextEarningsDate: { raw: number; fmt: string };
  nextDividendDate: { raw: number; fmt: string };
  nextExDividendDate: { raw: number; fmt: string };
}

interface CalendarEventItem {
  dateKey: string; // YYYY-MM-DD
  date: Date;
  symbol: string;
  type: EventType;
}

interface UpcomingEventsProps {
  symbols: string[];
}

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
  const day = d.getDay(); // 0=Sun .. 6=Sat
  return addDays(d, -day);
}

export default function UpcomingEvents({ symbols }: UpcomingEventsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Show the trailing week and the next three weeks, aligned to weeks (Sun-Sat)
  const rangeStart = useMemo(() => addDays(startOfWeekSunday(new Date()), -7), []);
  const rangeEnd = useMemo(() => addDays(rangeStart, 27), [rangeStart]); // inclusive visual range

  useEffect(() => {
    let isMounted = true;
    async function fetchAll() {
      if (!symbols || symbols.length === 0) return;
      setIsLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          symbols.map(async (symbol) => {
            const resp = await fetch(`/api/research/valuation/company/events?symbol=${encodeURIComponent(symbol)}`);
            if (!resp.ok) throw new Error(`Failed to fetch events for ${symbol}`);
            const data: CompanyCalendarEvents = await resp.json();
            return data;
          })
        );

        if (!isMounted) return;

        const aggregated: CalendarEventItem[] = [];
        results.forEach((evt) => {
          const pushIfInRange = (raw: number | undefined, type: EventType) => {
            if (!raw) return;
            const date = startOfDay(new Date(raw));
            if (date >= rangeStart && date <= rangeEnd) {
              const dateKey = toDateKey(date);
              aggregated.push({ dateKey, date, symbol: evt.symbol, type });
            }
          };

        	pushIfInRange(evt.nextEarningsDate?.raw, 'Earnings');
          pushIfInRange(evt.nextDividendDate?.raw, 'Dividend');
          pushIfInRange(evt.nextExDividendDate?.raw, 'Ex-Dividend');
        });

        // Sort by date then by type
        aggregated.sort((a, b) => a.date.getTime() - b.date.getTime() || a.type.localeCompare(b.type));
        setEvents(aggregated);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load events');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchAll();
    return () => {
      isMounted = false;
    };
  }, [symbols, rangeStart, rangeEnd]);

  const days = useMemo(() => {
    const out: { date: Date; dateKey: string }[] = [];
    for (let i = 0; i < 28; i++) {
      const date = addDays(rangeStart, i);
      out.push({ date, dateKey: toDateKey(date) });
    }
    return out;
  }, [rangeStart]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEventItem[]>();
    for (const evt of events) {
      if (!map.has(evt.dateKey)) map.set(evt.dateKey, []);
      map.get(evt.dateKey)!.push(evt);
    }
    return map;
  }, [events]);

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.rangeText}>
          {rangeStart.toLocaleDateString()} – {rangeEnd.toLocaleDateString()}
        </div>
        {isLoading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>

      <div className={styles.weekdays}>
        {weekdayLabels.map((lbl) => (
          <div key={lbl} className={styles.weekday}>
            {lbl}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {days.map(({ date, dateKey }) => {
          const dayEvents = eventsByDate.get(dateKey) || [];
          const isToday = toDateKey(startOfDay(new Date())) === dateKey;
          return (
            <div key={dateKey} className={`${styles.cell} ${isToday ? styles.today : ''}`}>
              <div className={styles.dateHeader}>
                <span className={styles.dateNumber}>{date.getDate()}</span>
                <span className={styles.dateMeta}>{date.toLocaleDateString(undefined, { month: 'short' })}</span>
              </div>
              <div className={styles.events}>
                {dayEvents.length === 0 ? (
                  <div className={styles.noEvent}>—</div>
                ) : (
                  dayEvents.map((evt, idx) => (
                    <div key={`${evt.symbol}-${evt.type}-${idx}`} className={`${styles.badge} ${styles[evt.type.replace(/[^A-Za-z]/g, '') as 'Earnings' | 'Dividend' | 'ExDividend']}`}>
                      <span className={styles.badgeType}>{evt.type}</span>
                      <span className={styles.badgeSymbol}>{evt.symbol}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


