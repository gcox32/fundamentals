import React, { useEffect, useMemo, useRef, useState } from 'react';
import { assetTypes } from '../StockSearchBar/config';
import styles from './styles.module.css';

interface AssetTypeSelectorProps {
  selectedAssetType: string;
  onAssetTypeChange: (assetType: string) => void;
}

export default function AssetTypeSelector({ 
  selectedAssetType, 
  onAssetTypeChange 
}: AssetTypeSelectorProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const [isScrollable, setIsScrollable] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const setButtonRef = (key: string) => (el: HTMLButtonElement | null) => {
    if (el) buttonRefs.current.set(key, el);
    else buttonRefs.current.delete(key);
  };

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.scrollWidth > el.clientWidth + 1;
    setIsScrollable(scrollable);
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
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
    const activeButton = buttonRefs.current.get(String(selectedAssetType));
    const container = scrollRef.current;
    if (activeButton && container) {
      activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedAssetType]);

  return (
    <div className={styles.container}>
      <div ref={scrollRef} className={`${styles.buttonGroup} ${isScrollable ? styles.scrollable : ''}`.trim()}>
        {assetTypes.map((type) => (
          <button
            key={type.code}
            ref={setButtonRef(type.code)}
            className={`${styles.button} ${selectedAssetType === type.code ? styles.active : ''}`}
            onClick={() => onAssetTypeChange(type.code)}
            type="button"
          >
            {type.name}
          </button>
        ))}
      </div>
    </div>
  );
} 