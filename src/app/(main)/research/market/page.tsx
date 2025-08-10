'use client';

import { useState } from 'react';
import HeaderOverview from "@/src/components/dashboard/research/market/HeaderOverview";
import ValuationView from "@/components/dashboard/research/market/ValuationView";
import LeadingIndicatorsView from "@/components/dashboard/research/market/LeadingIndicatorsView";
import SentimentView from "@/components/dashboard/research/market/SentimentView";
import styles from './styles.module.css';
import TabSelector, { TabItem } from '@/components/common/TabSelector';

type MarketTab = 'valuation' | 'leading' | 'sentiment';

export default function MarketResearch() {
  const [activeTab, setActiveTab] = useState<MarketTab>('valuation');

  const tabs: TabItem<MarketTab>[] = [
    { key: 'valuation', label: 'Valuation' },
    { key: 'leading', label: 'Leading Indicators' },
    { key: 'sentiment', label: 'Sentiment' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeaderOverview />

      <TabSelector tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />

      {activeTab === 'valuation' && (
        <div className={`${styles.tabContent} ${styles.visible}`}>
          <ValuationView />
        </div>
      )}

      {activeTab === 'leading' && (
        <div className={`${styles.tabContent} ${styles.visible}`}>
          <LeadingIndicatorsView />
        </div>
      )}

      {activeTab === 'sentiment' && (
        <div className={`${styles.tabContent} ${styles.visible}`}>
          <SentimentView />
        </div>
      )}
    </main>
  );
}