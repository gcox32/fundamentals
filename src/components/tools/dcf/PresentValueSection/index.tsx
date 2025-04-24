import React, { useState } from 'react';
import styles from './styles.module.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface PresentValueSectionProps {
  onSave: () => void;
  isLoading: boolean;
}

type OperatingModel = 'FCFE' | 'NET_INCOME' | 'FCFF' | 'FCFF_NO_CAPEX';

export default function PresentValueSection({ onSave, isLoading }: PresentValueSectionProps) {
  const [operatingModel, setOperatingModel] = useState<OperatingModel>('FCFE');
  const [forecastPeriod, setForecastPeriod] = useState(5);
  const [discountRate, setDiscountRate] = useState(7.79);
  const [terminalGrowth, setTerminalGrowth] = useState(0);

  // Sample data for the chart
  const revenueData = [
    { year: 'Year 1', value: 399, label: '399B' },
    { year: 'Year 2', value: 442, label: '442B' },
    { year: 'Year 3', value: 492, label: '492B' },
    { year: 'Year 4', value: 543, label: '543B' },
    { year: 'Year 5', value: 582, label: '582B' },
    { year: 'Terminal', value: 602, label: '602B' },
  ];

  const operatingModelOptions = [
    { value: 'FCFE', label: 'Equity Model: via FCFE' },
    { value: 'NET_INCOME', label: 'Equity Model: via Net Income' },
    { value: 'FCFF', label: 'Firm Model: via FCFF' },
    { value: 'FCFF_NO_CAPEX', label: 'Firm Model: via FCFF, w/o CapEx' },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>PRESENT VALUE CALCULATION</h2>
      
      <div className={styles.description}>
        This block is the starting point of the DCF valuation process. It calculates the present value 
        of a company's forecasted cash flows based on selected operating model. Adjust key parameters like 
        discount rate and terminal growth, and alter inputs such as revenue growth and margins to see their 
        impact on valuation.
      </div>

      <div className={styles.modelCard}>
        <div className={styles.modelHeader}>
          <div className={styles.modelIcon}>📊</div>
          <div>
            <h3>DCF Model</h3>
            <p>Base Case Scenario</p>
          </div>
        </div>

        <div className={styles.infoBox}>
          The present value of cash flows over the next 5 years amounts to 530.6B USD. 
          The present value of the terminal value is 1.5T USD. The total present value equals 2T USD.
        </div>

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label>Operating Model</label>
            <select 
              value={operatingModel}
              onChange={(e) => setOperatingModel(e.target.value as OperatingModel)}
              className={styles.modelSelect}
            >
              {operatingModelOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderControl}>
              <label>Forecast Period</label>
              <input
                type="range"
                min="1"
                max="10"
                value={forecastPeriod}
                onChange={(e) => setForecastPeriod(Number(e.target.value))}
              />
              <div className={styles.sliderValue}>{forecastPeriod} Years</div>
            </div>

            <div className={styles.sliderControl}>
              <label>Discount Rate</label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.01"
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
              />
              <div className={styles.sliderValue}>{discountRate}%</div>
            </div>

            <div className={styles.sliderControl}>
              <label>Terminal Growth</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={terminalGrowth}
                onChange={(e) => setTerminalGrowth(Number(e.target.value))}
              />
              <div className={styles.sliderValue}>{terminalGrowth}%</div>
            </div>
          </div>

          <div className={styles.presets}>
            <button className={styles.presetButton}>
              <span>📈</span> Use Historical Growth <span>-18%</span>
            </button>
            <button className={styles.presetButton}>
              <span>📊</span> Use Wall St Forecast <span>-9%</span>
            </button>
          </div>

          <div className={styles.revenueChart}>
            <h4>REVENUE</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.metrics}>
            <div className={styles.metric}>
              <label>Net Margin</label>
              <div>28% → 28%</div>
            </div>
            <div className={styles.metric}>
              <label>Net CapEx</label>
              <div>-4.9B → -3.4B</div>
            </div>
            <div className={styles.metric}>
              <label>Debt Ratio</label>
              <div>0% → 0%</div>
            </div>
          </div>

          <button className={styles.saveButton} onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 