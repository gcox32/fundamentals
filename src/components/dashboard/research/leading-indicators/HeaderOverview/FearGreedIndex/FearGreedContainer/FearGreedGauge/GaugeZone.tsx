import { ZONES } from "./config";
import { polarToCartesian } from "./utils";

type GaugeZoneProps = {
    zoneIndex: number;
    active: boolean;
};

const centerX = 169;
const centerY = 168;
const labelRadius = 90;


export default function GaugeZone({ zoneIndex, active }: GaugeZoneProps) {
    const { d, fill, angle, labelLines, labelOffsetY } = ZONES[zoneIndex];

    const { x, y } = polarToCartesian(centerX, centerY, labelRadius, angle);
    const fontSize = 10;
    return (
        <>
            <path
                d={d}
                fill={active ? fill : "var(--border-color)"}
                stroke={active ? "var(--border-color)" : "none"}
                strokeWidth={active ? 1.5 : 0}
            />
            <text
                x={x}
                y={y - 64}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="var(--gauge-text)"
                fontWeight={active ? "bold" : "normal"}
                transform={`rotate(${angle * 0.95}, ${x}, ${y + labelOffsetY})`}
                style={{
                    pointerEvents: "none",
                    userSelect: "none",
                    textTransform: "uppercase",
                }}
            >
                {labelLines.map((line, idx) => (
                    <tspan
                        key={idx}
                        x={x}
                        dy={idx === 0 ? "0" : fontSize + 1}
                        textAnchor="middle"
                    >
                        {line.toUpperCase()}
                    </tspan>
                ))}
            </text>
        </>
    );
}