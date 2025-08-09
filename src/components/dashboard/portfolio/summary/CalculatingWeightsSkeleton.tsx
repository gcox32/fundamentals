'use client';

import React from 'react';
import loading from '@/src/styles/loading.module.css';

function SkeletonBar({ width = '100%', height = 16, className = '' }: { width?: string; height?: number; className?: string }) {
  return (
    <div
      className={`${loading.pulse} ${className}`}
      style={{ width, height, borderRadius: 6, background: 'var(--background-secondary)' }}
    />
  );
}

export default function CalculatingWeightsSkeleton() {
  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-6 shadow">
      <SkeletonBar width="260px" height={22} className="mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonBar height={60} />
        <SkeletonBar height={60} />
        <SkeletonBar height={60} />
      </div>
    </div>
  );
}


