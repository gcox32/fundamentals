import { ChangeEvent } from 'react';
import styles from './styles.module.css';
import { FiInfo } from 'react-icons/fi';
import Tooltip from '@/components/common/Tooltip';

interface ValuationInputsProps {
  type: 'fcf' | 'eps';
  assumptions: any;
  onTypeChange: (type: 'fcf' | 'eps') => void;
  onAssumptionsChange: (assumptions: any) => void;
  isLoading: boolean;
}

export default function ValuationInputs({
  type,
  assumptions,
  onTypeChange,
  onAssumptionsChange,
  isLoading
}: ValuationInputsProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onAssumptionsChange({
      ...assumptions,
      [name]: parseFloat(value) || 0
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading company data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.typeSelector}>
        <button
          className={`${styles.typeButton} ${type === 'fcf' ? styles.active : ''}`}
          onClick={() => onTypeChange('fcf')}
        >
          Free Cash Flow
        </button>
        <button
          className={`${styles.typeButton} ${type === 'eps' ? styles.active : ''}`}
          onClick={() => onTypeChange('eps')}
        >
          Earnings Based
        </button>
      </div>

      <div className={styles.inputsContainer}>
        {type === 'fcf' ? (
          <>
            <div className={styles.inputGroup}>
              <label>
                Projection Years
                <Tooltip content="Number of years to project cash flows">
                  <FiInfo className={styles.infoIcon} />
                </Tooltip>
              </label>
              <input
                type="number"
                name="projectionYears"
                value={assumptions.projectionYears}
                onChange={handleInputChange}
                placeholder="Enter years..."
                min="3"
                max="10"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>
                Growth Rate
                <Tooltip content="Expected annual FCF growth rate">
                  <FiInfo className={styles.infoIcon} />
                </Tooltip>
              </label>
              <input
                type="number"
                name="fcfGrowthRate"
                value={assumptions.fcfGrowthRate * 100}
                onChange={(e) => handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: 'fcfGrowthRate',
                    value: String((parseFloat(e.target.value) || 0) / 100)
                  }
                })}
                placeholder="Enter growth rate..."
              />
              <span className={styles.inputSuffix}>%</span>
            </div>

            <div className={styles.inputGroup}>
              <label>
                Discount Rate (WACC)
                <Tooltip content="Weighted average cost of capital">
                  <FiInfo className={styles.infoIcon} />
                </Tooltip>
              </label>
              <input
                type="number"
                name="discountRate"
                value={assumptions.discountRate * 100}
                onChange={(e) => handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: 'discountRate',
                    value: String((parseFloat(e.target.value) || 0) / 100)
                  }
                })}
                placeholder="Enter discount rate..."
              />
              <span className={styles.inputSuffix}>%</span>
            </div>

            <div className={styles.inputGroup}>
              <label>
                Terminal Growth Rate
                <Tooltip content="Long-term sustainable growth rate">
                  <FiInfo className={styles.infoIcon} />
                </Tooltip>
              </label>
              <input
                type="number"
                name="terminalGrowthRate"
                value={assumptions.terminalGrowthRate * 100}
                onChange={(e) => handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: 'terminalGrowthRate',
                    value: String((parseFloat(e.target.value) || 0) / 100)
                  }
                })}
                placeholder="Enter terminal growth..."
              />
              <span className={styles.inputSuffix}>%</span>
            </div>
          </>
        ) : (
          <>

            <div className={styles.inputGroup}>
              <label>
                Projection Years
                <Tooltip content="Number of years to project earnings">
                  <FiInfo className={styles.infoIcon} />
                </Tooltip>
              </label>
              <input
                type="number"
                name="projectionYears"
                value={assumptions.projectionYears}
                onChange={handleInputChange}
                placeholder="Enter years..."
                min="1"
                max="10"
                step="1"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label>
                Growth Rate
                <Tooltip content="Expected annual EPS growth rate">
                  <FiInfo className={styles.infoIcon} />
                </Tooltip>
              </label>
              <input
                type="number"
                name="epsGrowthRate"
                value={assumptions.epsGrowthRate * 100}
                onChange={(e) => handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: 'epsGrowthRate',
                    value: String((parseFloat(e.target.value) || 0) / 100)
                  }
                })}
                placeholder="Enter growth rate..."
                step="0.1"
              />
              <span className={styles.inputSuffix}>%</span>
            </div>

            <div className={styles.inputGroup}>
              <label>
                Terminal P/E
                <Tooltip content="Expected P/E ratio at the end of projection period">
                  <FiInfo className={styles.infoIcon} />
                </Tooltip>
              </label>
              <input
                type="number"
                name="terminalPE"
                value={assumptions.terminalPE}
                onChange={handleInputChange}
                placeholder="Enter P/E ratio..."
                step="0.1"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 