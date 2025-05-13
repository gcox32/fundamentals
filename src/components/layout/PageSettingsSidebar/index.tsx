import React, { useState } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { FaMoon, FaSun, FaUndo, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './styles.module.css';
import { useHiddenCards } from '@/src/contexts/HiddenCardsContext';

export default function PageSettingsSidebar() {
  const { hiddenCards, showAllCards } = useHiddenCards();
  const {
    isDarkMode,
    toggleDarkMode,
    dashboardComponents,
    toggleComponent,
    resetDashboardLayout,
    leadingIndicators,
    toggleLeadingIndicator,
    resetLeadingIndicators
  } = useTheme();

  const toggleableComponents = dashboardComponents.filter(component => !component.isRequired);
  const toggleableLeadingIndicators = leadingIndicators.filter(indicator => !indicator.isRequired);
  const [isLayoutExpanded, setIsLayoutExpanded] = useState(true);
  const [isLeadingIndicatorsExpanded, setIsLeadingIndicatorsExpanded] = useState(true);
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
        <h3 
          className={`${styles.settingsTitle} ${styles.expandable}`}
          onClick={() => setIsLayoutExpanded(!isLayoutExpanded)}
          role="button"
          tabIndex={0}
        >
          Dashboard Layout {isLayoutExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </h3>
        <div className={`${styles.layoutContent} ${isLayoutExpanded ? styles.expanded : ''}`}>
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
              <FaUndo /> Reset Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Leading Indicators */}
      <div className={styles.settingsGroup}>
        <h3 
          className={`${styles.settingsTitle} ${styles.expandable}`}
          onClick={() => setIsLeadingIndicatorsExpanded(!isLeadingIndicatorsExpanded)}
          role="button"
          tabIndex={0}
        >
          Leading Indicators {isLeadingIndicatorsExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </h3>
        <div className={`${styles.layoutContent} ${isLeadingIndicatorsExpanded ? styles.expanded : ''}`}>
            <div className={styles.componentToggles}>
              {toggleableLeadingIndicators.map(indicator => (
                <div key={indicator.id} className={styles.componentToggle}>
                  <span className={styles.componentLabel}>{indicator.title}</span>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={indicator.isVisible}
                      onChange={() => toggleLeadingIndicator(indicator.id)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              ))}
            </div>
            <div className={styles.resetButtonContainer}>
              <button
                className={styles.resetButton}
                onClick={resetLeadingIndicators}
              >
                <FaUndo /> Reset Indicators
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}