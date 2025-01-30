'use client';

import React from 'react';
import styles from './styles.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Fund {
  symbol: string;
  name: string;
  description: string;
}

interface FundCarouselProps {
  funds: Fund[];
  onFundSelect: (fund: Fund) => void;
  selectedFund?: Fund | null;
}

export default function FundCarousel({ funds, onFundSelect, selectedFund }: FundCarouselProps) {
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainer.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainer.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <button 
        className={`${styles.scrollButton} ${styles.leftButton}`}
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        <FaChevronLeft />
      </button>

      <div className={styles.carouselTrack} ref={scrollContainer}>
        {funds.map((fund) => (
          <button
            key={fund.symbol}
            className={`${styles.fundCard} ${selectedFund?.symbol === fund.symbol ? styles.selected : ''}`}
            onClick={() => onFundSelect(fund)}
          >
            <h3 className={styles.fundSymbol}>{fund.symbol}</h3>
            <p className={styles.fundName}>{fund.name}</p>
            <p className={styles.fundDescription}>{fund.description}</p>
          </button>
        ))}
      </div>

      <button 
        className={`${styles.scrollButton} ${styles.rightButton}`}
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
