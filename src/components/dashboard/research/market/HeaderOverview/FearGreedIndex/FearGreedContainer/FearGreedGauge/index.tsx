import React from 'react';
import GaugeZone from './GaugeZone';
import { ZONES } from './config';
import GaugeNeedle from './GaugeNeedle';
import styles from './styles.module.css';
import ReferenceLabels from './ReferenceLabels';

type Props = {
  score: number; // 0–100
};

export default function FearGreedGauge({ score }: Props) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const zoneIndex = Math.floor(clampedScore / 20); // 0–4

  return (
    <div className="relative w-[500px] h-[250px]">
      <svg
        viewBox="0 0 338 173"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Zones */}
        {ZONES.map((_, idx) => (
          <GaugeZone key={idx} zoneIndex={idx} active={idx === zoneIndex} />
        ))}
      </svg>

      <ReferenceLabels />

      {/* Needle */}
      <GaugeNeedle value={clampedScore} />

      {/* Needle Base */}
      <div className={styles.handleBase} />

      {/* Value Display */}
      <div className={styles.dialHandNumber}>
        <span>{clampedScore}</span>
      </div>
    </div>
  );
};
