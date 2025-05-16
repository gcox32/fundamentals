import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import fs from 'fs/promises';

const s3 = new S3Client({
  region: process.env.REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY || ''
  }
});

// Add validation check
if (!process.env.ACCESS_KEY_ID || !process.env.SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
  console.error('Missing required environment variables:', {
    hasAccessKey: !!process.env.ACCESS_KEY_ID,
    hasSecretKey: !!process.env.SECRET_ACCESS_KEY,
    hasBucketName: !!process.env.S3_BUCKET_NAME
  });
}

const DB_PATH = path.join(process.cwd(), 'database', 'nyse.db');

async function ensureDatabase() {
  try {
    // Check if we already have a recent copy
    const stats = await fs.stat(DB_PATH);
    const ageInHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
    
    // If DB is less than 24 hours old, use it
    if (ageInHours < 24) {
      return;
    }
  } catch (error) {
    // File doesn't exist, continue to download
  }

  // Ensure database directory exists
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });

  // Download fresh copy from S3
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME || '',
    Key: 'public/fundamental/db/nyse.db'
  });

  const response = await s3.send(command);
  const writeStream = createWriteStream(DB_PATH);
  
  if (response.Body) {
    await pipeline(response.Body as any, writeStream);
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query?.trim()) {
    return NextResponse.json([]);
  }

  try {
    await ensureDatabase();

    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    const results = await db.all(
      `SELECT symbol, name
       FROM nyse_data 
       WHERE symbol LIKE ? OR name LIKE ? 
       LIMIT 10`,
      [`%${query.toUpperCase()}%`, `%${query}%`]
    );

    await db.close();
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 