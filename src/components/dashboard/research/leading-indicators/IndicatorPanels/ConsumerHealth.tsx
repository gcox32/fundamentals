import VisibilityWrapper from "../../valuation/VisibilityWrapper";
import ChartModal from "@/src/components/dashboard/research/leading-indicators/common/ChartModal";
import { useEffect, useState } from 'react';

type DataPoint = { date: string; value: number };
type PCEData = {
    latest: DataPoint;
    trend: string;
    growth: string;
    series: DataPoint[];
};

export default function ConsumerHealth({ data }: { data: PCEData }) {
    const [showChart, setShowChart] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (!showChart) {
            setShowChart(true);
        }
    };

    if (!data) {
        return (
            <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Consumer Health</h2>
                <p className="text-[var(--text-secondary)]">Loading...</p>
            </section>
        );
    }
    return (
        <VisibilityWrapper componentId="consumer-health">
            <section
                className="p-6 bg-[var(--card-bg)] rounded-lg shadow cursor-pointer hover:bg-[var(--background-hover)] transition"
                onClick={handleClick}
            >
                <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Consumer Health</h2>
                <div className="space-y-2">
                    <p className="text-2xl font-bold text-[var(--text)]">{data.trend}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Latest PCE: ${data.latest.value.toLocaleString()}B ({data.growth}% MoM)
                    </p>
                </div>

                {showChart && (
                    <ChartModal
                        title="Personal Consumption Expenditures"
                        data={data.series}
                        onClose={() => setShowChart(false)}
                    />
                )}
            </section>
        </VisibilityWrapper>
    );
}