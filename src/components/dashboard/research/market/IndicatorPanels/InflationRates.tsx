'use client';

import VisibilityWrapper from "@/src/components/dashboard/research/valuation/VisibilityWrapper";
import { useEffect, useState } from 'react';
import MultiChartModal from "../common/MultiChartModal";

type DataPoint = { date: string; value: number };
type InflationRatesData = {
    cpi: { latest: DataPoint; trend: string; series: DataPoint[] };
    ppi: { latest: DataPoint; trend: string; series: DataPoint[] };
    fedFunds: { latest: DataPoint; trend: string; series: DataPoint[] };
};

export default function InflationRates({ data }: { data: InflationRatesData }) {
    const [showChart, setShowChart] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (!showChart) {
            setShowChart(true);
        }
    };

    if (!data) {
        return (
            <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Inflation & Rates</h2>
                <p className="text-[var(--text-secondary)]">Loading...</p>
            </section>
        );
    }

    return (
        <VisibilityWrapper componentId="inflation-rates">
            <section
                className="p-6 bg-[var(--card-bg)] rounded-lg shadow cursor-pointer hover:bg-[var(--background-hover)] transition"
                onClick={handleClick}
            >
                <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Inflation & Rates</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">CPI (YoY)</h3>
                        <p className="text-lg font-bold text-[var(--text)]">
                            {data.cpi.latest.value.toFixed(1)}% ({data.cpi.trend})
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">PPI (YoY)</h3>
                        <p className="text-lg font-bold text-[var(--text)]">
                            {data.ppi.latest.value.toFixed(1)}% ({data.ppi.trend})
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">Fed Funds Rate</h3>
                        <p className="text-lg font-bold text-[var(--text)]">
                            {data.fedFunds.latest.value.toFixed(2)}% ({data.fedFunds.trend})
                        </p>
                    </div>
                </div>
                {showChart && (
                    <MultiChartModal
                        isOpen={showChart}
                        onClose={() => setShowChart(false)}
                        charts={[
                            { title: "CPI (YoY)", data: data.cpi.series },
                            { title: "PPI (YoY)", data: data.ppi.series },
                            { title: "Fed Funds Rate", data: data.fedFunds.series },
                        ]}
                    />
                )}
            </section>
        </VisibilityWrapper>
    );
}
