import React from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';
import styles from './styles.module.css';

export default function PageSettingsSidebar() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className={styles.settingsSidebar}>
      <h2>Settings</h2>
      <div className={styles.settingsGroup}>
        <div className={styles.themeToggle}>
          <span className={styles.themeToggleLabel}>
            <span className={styles.icon}>
              {isDarkMode ? <FaMoon /> : <FaSun />}
            </span>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
              aria-label="Toggle dark mode"
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
}