'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FundCard from './FundCard';

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
  const [activeIndex, setActiveIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Handle wheel/scroll events
  const handleWheel = (event: WheelEvent) => {
    // Only handle horizontal scrolling or when shift is pressed
    if (event.deltaX !== 0 || event.shiftKey) {
      event.preventDefault();
      
      // Determine direction based on scroll delta
      const direction = (event.deltaX || event.deltaY) > 0 ? 'right' : 'left';
      
      // Use a threshold to prevent over-sensitive scrolling
      if (Math.abs(event.deltaX || event.deltaY) > 30) {
        moveCarousel(direction);
      }
    }
  };

  // Handle touch events for mobile/trackpad gestures
  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 2) { // Only handle two-finger gestures
      event.preventDefault();
      setTouchStartX(event.touches[0].clientX);
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 2 && touchStartX !== null) {
      event.preventDefault();
      const touchDelta = event.touches[0].clientX - touchStartX;
      
      // Use a threshold to determine if we should move the carousel
      if (Math.abs(touchDelta) > 30) {
        const direction = touchDelta > 0 ? 'left' : 'right';
        moveCarousel(direction);
        setTouchStartX(null); // Reset to prevent multiple moves
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  // Set up event listeners
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('wheel', handleWheel, { passive: false });
      carousel.addEventListener('touchstart', handleTouchStart, { passive: false });
      carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
      carousel.addEventListener('touchend', handleTouchEnd);

      return () => {
        carousel.removeEventListener('wheel', handleWheel);
        carousel.removeEventListener('touchstart', handleTouchStart);
        carousel.removeEventListener('touchmove', handleTouchMove);
        carousel.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, []);

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
        'transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 
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
    setTimeout(() => {
      setIsAnimating(false);
      onFundSelect(funds[newIndex]);
    }, 500);
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
            <FundCard
              key={fund.symbol}
              fund={fund}
              isSelected={selectedFund?.symbol === fund.symbol}
              style={calculateCardStyles(index)}
              onClick={() => handleCardClick(fund, index)}
            />
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
