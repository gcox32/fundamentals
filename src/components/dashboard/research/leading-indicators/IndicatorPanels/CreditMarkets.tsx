'use client';

import VisibilityWrapper from "../../valuation/VisibilityWrapper";
import { useEffect, useState } from 'react';
import Modal from "@/src/components/common/Modal";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

type CreditDataPoint = {
    date: string;
    igSpread: number;
    hySpread: number;
};

type CreditData = {
    latest: CreditDataPoint;
    trend: string;
    series: CreditDataPoint[];
};

export default function CreditMarkets({ data }: { data: CreditData }) {
    const [showChart, setShowChart] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (!showChart) {
            setShowChart(true);
        }
    };

    if (!data) {
        return (
            <section className="bg-[var(--card-bg)] shadow p-6 rounded-lg">
                <h2 className="mb-4 font-bold text-[var(--text)] text-xl">Credit Markets</h2>
                <p className="text-[var(--text-secondary)]">Loading...</p>
            </section>
        );
    }

    return (
        <VisibilityWrapper componentId="credit-markets">
            <section
                className="bg-[var(--card-bg)] hover:bg-[var(--background-hover)] shadow p-6 rounded-lg transition cursor-pointer"
                onClick={handleClick}
            >
                <h2 className="mb-4 font-bold text-[var(--text)] text-xl">Credit Markets</h2>
                <div className="gap-4 grid grid-cols-2">
                    <div>
                        <h3 className="font-semibold text-[var(--text-secondary)] text-sm">IG Spread</h3>
                        <p className="font-bold text-[var(--text)] text-lg">{data.latest.igSpread} bps</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--text-secondary)] text-sm">HY Spread</h3>
                        <p className="font-bold text-[var(--text)] text-lg">{data.latest.hySpread} bps</p>
                    </div>
                </div>
                <p className="mt-2 text-[var(--text-secondary)] text-sm">{data.trend}</p>

                {showChart && (
                    <Modal
                        isOpen={showChart}
                        onClose={() => setShowChart(false)}
                        title="Credit Spreads (IG vs HY)"
                        maxWidth="800px"
                    >
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.series}>
                                    <CartesianGrid horizontal={true} vertical={false} stroke={isDarkMode ? "#404040" : "#f0f0f0"} />
                                    <XAxis dataKey="date" tickFormatter={tick => tick.slice(0, 7)} />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="igSpread"
                                        name="IG Spread"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="hySpread"
                                        name="HY Spread"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Modal>
                )}
            </section>
        </VisibilityWrapper>
    );
}
