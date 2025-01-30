'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const calculateCardStyles = (index: number) => {
    const offset = index - activeIndex;
    const rotateY = offset * 45; // Rotate each card by 45 degrees
    const translateZ = Math.abs(offset) * -100; // Push cards back in 3D space
    const translateX = offset * 60; // Spread cards horizontally
    const opacity = index === activeIndex ? 1 : Math.max(0.2, 1 - Math.abs(offset) * 0.3);

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
      opacity,
      zIndex: funds.length - Math.abs(offset),
      transition: isAnimating ? 
        'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 
        'none'
    };
  };

  const moveCarousel = (direction: 'left' | 'right') => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newIndex = direction === 'left' 
      ? (activeIndex - 1 + funds.length) % funds.length
      : (activeIndex + 1) % funds.length;
    
    setActiveIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleCardClick = (fund: Fund, index: number) => {
    if (index === activeIndex) {
      onFundSelect(fund);
      return;
    }

    setIsAnimating(true);
    setActiveIndex(index);
    
    // Wait for the animation to complete before selecting the fund
    setTimeout(() => {
      setIsAnimating(false);
      onFundSelect(fund);
    }, 500);
  };

  return (
    <div className={styles.carouselContainer}>
      <button 
        className={`${styles.scrollButton} ${styles.leftButton}`}
        onClick={() => moveCarousel('left')}
        aria-label="Previous fund"
      >
        <FaChevronLeft />
      </button>

      <div className={styles.carouselStage} ref={carouselRef}>
        <div className={styles.carouselTrack}>
          {funds.map((fund, index) => (
            <button
              key={fund.symbol}
              className={`${styles.fundCard} ${selectedFund?.symbol === fund.symbol ? styles.selected : ''}`}
              onClick={() => handleCardClick(fund, index)}
              style={calculateCardStyles(index)}
            >
              <h3 className={styles.fundSymbol}>{fund.symbol}</h3>
              <p className={styles.fundName}>{fund.name}</p>
              <p className={styles.fundDescription}>{fund.description}</p>
            </button>
          ))}
        </div>
      </div>

      <button 
        className={`${styles.scrollButton} ${styles.rightButton}`}
        onClick={() => moveCarousel('right')}
        aria-label="Next fund"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
