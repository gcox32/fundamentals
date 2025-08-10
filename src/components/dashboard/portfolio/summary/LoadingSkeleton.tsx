'use client';

import React from 'react';
import loading from '@/src/styles/loading.module.css';

function SkeletonBar({ width = '100%', height = 16, className = '' }: { width?: string; height?: number; className?: string }) {
  return (
    <div
      className={`${loading.pulse} ${className}`}
      style={{
        width,
        height,
        borderRadius: 6,
        background: 'var(--background-secondary)',
      }}
    />
  );
}

function SkeletonCard({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-6 shadow">
      {children}
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Portfolio Selector Skeleton */}
      <div>
        <SkeletonBar width="240px" height={20} className="mb-3" />
        <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-4">
          <SkeletonBar width="100%" height={44} />
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonCard>
          <SkeletonBar width="50%" height={24} className="mb-4" />
          <SkeletonBar width="100%" height={180} />
        </SkeletonCard>
        <SkeletonCard>
          <SkeletonBar width="60%" height={24} className="mb-4" />
          <SkeletonBar width="100%" height={180} />
        </SkeletonCard>
        <SkeletonCard>
          <SkeletonBar width="40%" height={24} className="mb-4" />
          <div className="space-y-3">
            <SkeletonBar width="100%" height={18} />
            <SkeletonBar width="95%" height={18} />
            <SkeletonBar width="90%" height={18} />
            <SkeletonBar width="85%" height={18} />
          </div>
        </SkeletonCard>
        <SkeletonCard>
          <SkeletonBar width="45%" height={24} className="mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <SkeletonBar width="100%" height={80} />
            <SkeletonBar width="100%" height={80} />
            <SkeletonBar width="100%" height={80} />
            <SkeletonBar width="100%" height={80} />
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}


