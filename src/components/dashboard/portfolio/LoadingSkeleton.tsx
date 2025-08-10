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

function SkeletonCard({ height = 220 }: { height?: number }) {
  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-6 shadow mb-8">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-full" style={{ background: 'var(--background-secondary)' }} />
        <div className="flex-1">
          <SkeletonBar width="35%" height={24} className="mb-2" />
          <SkeletonBar width="20%" height={16} />
        </div>
      </div>
      <SkeletonBar width="100%" height={height} />
    </div>
  );
}

export default function PortfolioLoadingSkeleton() {
  return (
    <div className="p-8">
      <SkeletonCard />
      <div className="mt-6 flex justify-end items-center gap-4">
        <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 min-w-[260px]">
          <SkeletonBar width="100%" height={24} />
        </div>
        <SkeletonBar width="160px" height={44} />
      </div>
    </div>
  );
}


