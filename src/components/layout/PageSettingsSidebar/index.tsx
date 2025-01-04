import React from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { FaMoon, FaSun, FaUndo, FaEye } from 'react-icons/fa';
import styles from './styles.module.css';
import { useHiddenCards } from '@/src/contexts/HiddenCardsContext';

export default function PageSettingsSidebar() {
  const { hiddenCards, showAllCards } = useHiddenCards();
  const {
    isDarkMode,
    toggleDarkMode,
    dashboardComponents,
    toggleComponent,
    resetDashboardLayout
  } = useTheme();

  const toggleableComponents = dashboardComponents.filter(component => !component.isRequired);

  return (
    <div className={styles.settingsSidebar}>

      <div className={styles.settingsGroup}>
        <h3 className={styles.settingsTitle}>Theme</h3>
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

      <div className={styles.settingsGroup}>
        <h3 className={styles.settingsTitle}>Dashboard Layout</h3>
        <div className={styles.componentToggles}>
          {toggleableComponents.map(component => (
            <div key={component.id} className={styles.componentToggle}>
              <span className={styles.componentLabel}>{component.title}</span>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={component.isVisible}
                  onChange={() => toggleComponent(component.id)}
                  aria-label={`Toggle ${component.title}`}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          ))}
         <h3 className={styles.settingsTitle}>Hidden Cards</h3>
         <button
            className={styles.showAllButton}
            onClick={showAllCards}
            disabled={!hiddenCards?.size}
         >
            <FaEye /> {hiddenCards?.size ? `Show All (${hiddenCards.size})` : 'No Hidden Cards'}
          </button>
        </div>
        <div className={styles.resetButtonContainer}>
          <button
            className={styles.resetButton}
            onClick={resetDashboardLayout}
        >
            <FaUndo /> Reset Layout
          </button>
        </div>
      </div>
    </div>
  );
}