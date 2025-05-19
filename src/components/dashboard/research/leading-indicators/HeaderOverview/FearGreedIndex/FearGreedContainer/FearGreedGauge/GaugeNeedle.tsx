'use client';

import { useEffect, useState } from "react";

type NeedleProps = {
    value: number;
    minAngle?: number; // default -90
    maxAngle?: number; // default 90
};

export default function GaugeNeedle({ value, minAngle = -90, maxAngle = 90 }: NeedleProps) {
    const clamped = Math.max(0, Math.min(100, value));
    const targetAngle = (clamped / 100) * (maxAngle - minAngle) + minAngle;

    const [angle, setAngle] = useState(minAngle); // start from minAngle

    useEffect(() => {
        // Animate to target angle on value change
        const timeout = setTimeout(() => {
            setAngle(targetAngle);
        }, 50); // small delay to make it visible on initial load

        return () => clearTimeout(timeout);
    }, [targetAngle]);

    return (
        <div
            className="absolute bottom-[2%] left-[48%] z-2"
            style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: "bottom",
                transition: "transform 500ms ease-out",
            }}
        >
            <svg viewBox="0 0 10 124" className="w-5 h-[200px]">
                <path
                    d="M5,0.2c-0.6,0-1.1,0.5-1.1,1.1L0.8,106.7c0,2.3-0.1,13.6,2.6,16.3c0.6,0.6,1.3,0.7,1.8,0.7l0,0c0.5,0,1.1-0.2,1.7-0.9c0.1-0.2,0.3-0.3,0.4-0.5c2.2-3.6,1.7-13.9,1.6-16L6.1,1.3C6.1,0.7,5.6,0.2,5,0.2"
                    fill="#111"
                />
            </svg>
        </div>
    );
}
