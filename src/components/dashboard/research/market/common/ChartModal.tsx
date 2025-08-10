'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Modal from '@/components/common/Modal';
import styles from '@/components/common/Toggle/styles.module.css';
import clsx from 'clsx';
import { useTheme } from '@/src/contexts/ThemeContext';

type Props = {
  title: string;
  data: { date: string; value: number }[];
  onClose: () => void;
  mode?: 'yoy' | 'mom';
  onToggleMode?: () => void;
};

export default function ChartModal({ title, data, onClose, mode, onToggleMode }: Props) {
  const { isDarkMode } = useTheme();
  
  return (
    <Modal isOpen={true} onClose={onClose} title={title} maxWidth="800px">
      {mode && onToggleMode && (
        <div className={styles.toggleContainer}>
          <div className={styles.toggleWrapper}>
            <button
              onClick={() => mode === 'mom' && onToggleMode()}
              className={clsx(styles.toggleButton, mode === 'yoy' ? styles.active : styles.inactive)}
            >
              YoY
            </button>
            <button
              onClick={() => mode === 'yoy' && onToggleMode()}
              className={clsx(styles.toggleButton, mode === 'mom' ? styles.active : styles.inactive)}
            >
              MoM
            </button>
            <div className={clsx(styles.slider, mode === 'mom' ? styles.sliderRight : styles.sliderLeft)} />
          </div>
        </div>
      )}

      <div style={{ width: '100%', height: 550 }}>
        <ResponsiveContainer>
          <LineChart data={data} style={{ height: 'auto', width: 'auto', margin: '0 2rem 2rem 2rem'}}>
            <CartesianGrid horizontal={true} vertical={false} stroke={isDarkMode ? "#404040" : "#f0f0f0"} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(tick) => tick.slice(0, 7)} 
              angle={-45}
              textAnchor={"end"}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)}%`}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--active-accent)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Modal>
  );
}
  