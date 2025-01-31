import React from 'react';
import styles from './styles.module.css';

interface ThemeFilterProps {
  themes: string[];
  selectedThemes: string[];
  onThemeSelect: (theme: string) => void;
}

export default function ThemeFilter({ themes, selectedThemes, onThemeSelect }: ThemeFilterProps) {
  return (
    <div className={styles.container}>
      <div className={styles.scrollContainer}>
        {themes.map((theme) => (
          <button
            key={theme}
            className={`${styles.themeButton} ${selectedThemes.includes(theme) ? styles.selected : ''}`}
            onClick={() => onThemeSelect(theme)}
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
} 