import React from 'react';
import styles from './styles.module.css';

interface ThemeFilterProps {
    themes: { name: string; count: number }[];
    selectedThemes: string[];
    onThemeSelect: (theme: string) => void;
}

export default function ThemeFilter({ themes, selectedThemes, onThemeSelect }: ThemeFilterProps) {
    return (
        <div className={styles.container}>
            <div className={styles.scrollContainer}>
                {themes.map((theme) => (
                    <button
                        key={theme.name}
                        className={`${styles.themeButton} ${selectedThemes.includes(theme.name) ? styles.selected : ''}`}
                        onClick={() => onThemeSelect(theme.name)}
                    >
                        {theme.name} <span className={styles.count}>({theme.count})</span>
                    </button>
                ))}
            </div>
        </div>
    );
} 