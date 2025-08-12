import { NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

type EconomicCalendarRow = {
  date: string;
  country: string;
  event: string;
  currency: string | null;
  previous: number | null;
  estimate: number | null;
  actual: number | null;
  change_value: number | null;
  impact: string | null;
  change_percentage: number | null;
  unit: string | null;
};

function resolveDbPath(): string {
  const cwd = process.cwd();
  const dataDb = path.join(cwd, 'database', 'data.db');
  if (fs.existsSync(dataDb)) return dataDb;
  return dataDb;
}

function toStartOfDay(dateStr: string): string {
  return `${dateStr} 00:00:00`;
}

function toEndOfDay(dateStr: string): string {
  return `${dateStr} 23:59:59`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const country = searchParams.get('country') || 'US';
    const impact = searchParams.get('impact'); // optional
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Math.max(parseInt(limitParam || '500', 10) || 500, 1), 5000);

    if (!from || !to) {
      return NextResponse.json({ error: 'Missing required query params: from, to (YYYY-MM-DD)' }, { status: 400 });
    }

    const dbPath = resolveDbPath();
    const db = await open({ filename: dbPath, driver: sqlite3.Database });

    try {
      // Ensure table exists to avoid errors if script hasn't run yet
      await db.exec(`
        CREATE TABLE IF NOT EXISTS economic_calendar (
          date TEXT NOT NULL,
          country TEXT NOT NULL,
          event TEXT NOT NULL,
          currency TEXT,
          previous REAL,
          estimate REAL,
          actual REAL,
          change_value REAL,
          impact TEXT,
          change_percentage REAL,
          unit TEXT,
          source TEXT DEFAULT 'FMP',
          created_at TEXT DEFAULT (datetime('now')),
          PRIMARY KEY (date, country, event)
        );
      `);

      const params: Array<string | number> = [country, toStartOfDay(from), toEndOfDay(to)];
      let sql = `
        SELECT date, country, event, currency, previous, estimate, actual, change_value, impact, change_percentage, unit
        FROM economic_calendar
        WHERE country = ?
          AND date BETWEEN ? AND ?
      `;
      if (impact) {
        sql += ' AND impact = ?';
        params.push(impact);
      }
      sql += ' ORDER BY date ASC LIMIT ?';
      params.push(limit);

      const rows = (await db.all(sql, params)) as EconomicCalendarRow[];

      // Shape the response to be close to the FMP payload fields
      const result = rows.map((r) => ({
        date: r.date,
        country: r.country,
        event: r.event,
        currency: r.currency,
        previous: r.previous,
        estimate: r.estimate,
        actual: r.actual,
        change: r.change_value,
        impact: r.impact,
        changePercentage: r.change_percentage,
        unit: r.unit,
      }));

      return NextResponse.json(result, { status: 200 });
    } finally {
      await db.close();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


