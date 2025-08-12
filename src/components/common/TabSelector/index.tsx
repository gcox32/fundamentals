'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());

  const [isScrollable, setIsScrollable] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const setButtonRef = (key: string) => (el: HTMLButtonElement | null) => {
    if (el) {
      buttonRefs.current.set(key, el);
    } else {
      buttonRefs.current.delete(key);
    }
  };

  const updateScrollState = () => {
    const el = containerRef.current;
    if (!el) return;
    const scrollable = el.scrollWidth > el.clientWidth + 1;
    setIsScrollable(scrollable);
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => updateScrollState();
    el.addEventListener('scroll', onScroll, { passive: true });
    const onResize = () => updateScrollState();
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const activeButton = buttonRefs.current.get(String(activeKey));
    const container = containerRef.current;
    if (activeButton && container) {
      // Smoothly bring the active tab into view and center it when overflowed
      activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeKey]);

  const containerClasses = useMemo(() => {
    const base = [styles.tabsContainer];
    if (className) base.push(className);
    if (isScrollable) base.push(styles.scrollable);
    if (!atStart) base.push(styles.shadowLeft);
    if (!atEnd) base.push(styles.shadowRight);
    return base.join(' ');
  }, [className, isScrollable, atStart, atEnd]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const currentIndex = tabs.findIndex((t) => t.key === activeKey);
    if (e.key === 'ArrowRight') {
      const next = Math.min(tabs.length - 1, currentIndex + 1);
      onChange(tabs[next].key);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      const prev = Math.max(0, currentIndex - 1);
      onChange(tabs[prev].key);
      e.preventDefault();
    }
  };

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          ref={setButtonRef(String(tab.key))}
          className={`${styles.tabButton} ${activeKey === tab.key ? styles.active : ''}`}
          onClick={() => onChange(tab.key)}
          type="button"
          role="tab"
          aria-selected={activeKey === tab.key}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}


