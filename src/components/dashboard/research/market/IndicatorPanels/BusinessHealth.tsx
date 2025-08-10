'use client';

import VisibilityWrapper from "../../valuation/VisibilityWrapper";
import ChartModal from "@/src/components/dashboard/research/market/common/ChartModal";
import { useEffect, useState } from 'react';

type DataPoint = { date: string; value: number };
type ISMData = {
    trend: string;
    latest: DataPoint;
    change: number;
    series: {
        composite: DataPoint[];
    };
};

export default function BusinessHealth({ data }: { data: ISMData }) {
    const [showChart, setShowChart] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (!showChart) {
            setShowChart(true);
        }
    };

    if (!data) {
        return (
            <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Business Health</h2>
                <p className="text-[var(--text-secondary)]">Loading...</p>
            </section>
        );
    }

    return (
        <VisibilityWrapper componentId="business-health">
            <section
                className="p-6 bg-[var(--card-bg)] rounded-lg shadow cursor-pointer hover:bg-[var(--background-hover)] transition"
                onClick={handleClick}
            >
                <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Business Health</h2>
                <div className="space-y-2">
                    <p className="text-2xl font-bold text-[var(--text)]">{data.trend}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                        CFNAI: {data.latest.value.toFixed(2)} ({data.change} MoM)
                    </p>

                </div>

                {showChart && (
                    <ChartModal
                        title="ISM Composite (Manufacturing + Services)"
                        data={data.series.composite}
                        onClose={() => setShowChart(false)}
                    />
                )}
            </section>
        </VisibilityWrapper>
    );
}
