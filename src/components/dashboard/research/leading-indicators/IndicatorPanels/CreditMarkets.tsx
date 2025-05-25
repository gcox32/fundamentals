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

export default function CreditMarkets() {
    const [data, setData] = useState<CreditData | null>(null);
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        fetch('/api/research/composite/credit-markets')
            .then(res => res.json())
            .then(setData);
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        if (!showChart) {
            setShowChart(true);
        }
    };

    if (!data) {
        return (
            <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Credit Markets</h2>
                <p className="text-[var(--text-secondary)]">Loading...</p>
            </section>
        );
    }

    return (
        <VisibilityWrapper componentId="credit-markets">
            <section
                className="p-6 bg-[var(--card-bg)] rounded-lg shadow cursor-pointer hover:bg-[var(--background-hover)] transition"
                onClick={handleClick}
            >
                <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Credit Markets</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">IG Spread</h3>
                        <p className="text-lg font-bold text-[var(--text)]">{data.latest.igSpread} bps</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">HY Spread</h3>
                        <p className="text-lg font-bold text-[var(--text)]">{data.latest.hySpread} bps</p>
                    </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-2">{data.trend}</p>

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
                                    <CartesianGrid strokeDasharray="3 3" />
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
