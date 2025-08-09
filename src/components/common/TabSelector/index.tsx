'use client';

import React from 'react';
import styles from './styles.module.css';

export type TabItem<Key extends string = string> = {
  key: Key;
  label: string;
};

type TabSelectorProps<Key extends string = string> = {
  tabs: TabItem<Key>[];
  activeKey: Key;
  onChange: (key: Key) => void;
  className?: string;
};

export default function TabSelector<Key extends string = string>({
  tabs,
  activeKey,
  onChange,
  className,
}: TabSelectorProps<Key>) {
  return (
    <div className={`${styles.tabsContainer} ${className ?? ''}`.trim()}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.tabButton} ${activeKey === tab.key ? styles.active : ''}`}
          onClick={() => onChange(tab.key)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}


