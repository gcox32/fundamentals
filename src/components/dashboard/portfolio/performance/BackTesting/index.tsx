import { HistoricalPriceData } from "@/types/stock";
import styles from "./styles.module.css";
import { useState, useMemo } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
} from "recharts";
import { formatLargeNumber, formatPrice } from "@/src/lib/utilities/format";
import { fetchValuationData } from "@/src/lib/valuation/fetchValuationData";
import { useTheme } from "@/src/contexts/ThemeContext";

interface BackTestingProps {
    portfolioHistoricalPrices: HistoricalPriceData[];
    weights: number[];
}

interface PortfolioValue {
    date: string;
    value: number;
    spyValue?: number;
    qqqValue?: number;
}

const timeframes = [
    { value: "1Y", label: "1 Year" },
    { value: "3Y", label: "3 Years" },
    { value: "5Y", label: "5 Years" },
];

export default function BackTesting({ portfolioHistoricalPrices, weights }: BackTestingProps) {
    const [selectedTimeframe, setSelectedTimeframe] = useState("1Y");
    const [spyData, setSpyData] = useState<HistoricalPriceData | null>(null);
    const [qqqData, setQqqData] = useState<HistoricalPriceData | null>(null);
    const [showSpy, setShowSpy] = useState(true);
    const [showQqq, setShowQqq] = useState(true);
    const { isDarkMode } = useTheme();
    
    // Fetch benchmark data
    useMemo(() => {
        fetchValuationData(
            'stock/historical/price',
            'SPY',
            (data: HistoricalPriceData) => setSpyData(data),
            (err) => console.error('Error fetching SPY data:', err)
        );
        fetchValuationData(
            'stock/historical/price',
            'QQQ',
            (data: HistoricalPriceData) => setQqqData(data),
            (err) => console.error('Error fetching QQQ data:', err)
        );
    }, []);

    const chartData = useMemo(() => {
        if (!portfolioHistoricalPrices.length) return [];

        // Get all unique dates from all stocks
        const allDates = new Set<string>();
        portfolioHistoricalPrices.forEach(stock => {
            stock.historical.forEach(price => allDates.add(price.date));
        });

        // Sort dates in ascending order
        const sortedDates = Array.from(allDates).sort();

        // Calculate the start date based on the selected timeframe
        const now = new Date();
        const startDate = new Date();

        switch (selectedTimeframe) {
            case "1Y":
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            case "3Y":
                startDate.setFullYear(now.getFullYear() - 3);
                break;
            case "5Y":
                startDate.setFullYear(now.getFullYear() - 5);
                break;
        }

        // Find the closest date to our calculated start date
        const closestStartDate = sortedDates.reduce((closest, current) => {
            const currentDiff = Math.abs(new Date(current).getTime() - startDate.getTime());
            const closestDiff = Math.abs(new Date(closest).getTime() - startDate.getTime());
            return currentDiff < closestDiff ? current : closest;
        });

        // Filter dates to only include those after our start date
        const filteredDates = sortedDates.filter(date => date >= closestStartDate);

        // Calculate portfolio value for each date
        const portfolioValues: PortfolioValue[] = filteredDates.map(date => {
            let totalValue = 0;
            let hasAllPrices = true;

            portfolioHistoricalPrices.forEach((stock, index) => {
                const priceData = stock.historical.find(p => p.date === date);
                const startPriceData = stock.historical.find(p => p.date === closestStartDate);

                if (!priceData || !startPriceData) {
                    hasAllPrices = false;
                    return;
                }

                // Calculate weighted value based on the start date of the selected timeframe
                const weightedValue = 10000 * (weights[index] / 100) * (priceData.adjClose / startPriceData.adjClose);
                totalValue += weightedValue;
            });

            // Calculate benchmark values
            let spyValue = undefined;
            let qqqValue = undefined;

            if (spyData) {
                const spyPrice = spyData.historical.find(p => p.date === date);
                const spyStartPrice = spyData.historical.find(p => p.date === closestStartDate);
                if (spyPrice && spyStartPrice) {
                    spyValue = 10000 * (spyPrice.adjClose / spyStartPrice.adjClose);
                }
            }

            if (qqqData) {
                const qqqPrice = qqqData.historical.find(p => p.date === date);
                const qqqStartPrice = qqqData.historical.find(p => p.date === closestStartDate);
                if (qqqPrice && qqqStartPrice) {
                    qqqValue = 10000 * (qqqPrice.adjClose / qqqStartPrice.adjClose);
                }
            }

            return hasAllPrices ? {
                date,
                value: totalValue,
                spyValue,
                qqqValue,
            } : null;
        }).filter((item): item is NonNullable<typeof item> => item !== null);

        return portfolioValues;
    }, [portfolioHistoricalPrices, weights, selectedTimeframe, spyData, qqqData]);

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Historical Performance</h2>
            <div className={styles.card}>
                <div className={styles.grid}>
                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>{`Price Performance over ${selectedTimeframe} Timeframe`}</h3>
                        <div style={{ width: "100%", height: 400 }}>
                            <ResponsiveContainer>
                                <LineChart data={chartData}>
                                    <CartesianGrid horizontal={true} vertical={false} stroke={isDarkMode ? "#404040" : "#f0f0f0"} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString()}
                                        angle={-45}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => formatPrice(value)}
                                        domain={["auto", "auto"]}
                                    />
                                    <Tooltip
                                        formatter={(value: number, name: string) => {
                                            const formattedValue = formatPrice(value);
                                            const returnValue = ((value / 10000 - 1) * 100).toFixed(2);
                                            return [`${formattedValue} (${returnValue}%)`, name];
                                        }}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        name="Portfolio"
                                        stroke="#2196F3"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    {showSpy && (
                                        <Line
                                            type="monotone"
                                            dataKey="spyValue"
                                            name="S&P 500"
                                            stroke="#4CAF50"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    )}
                                    {showQqq && (
                                        <Line
                                            type="monotone"
                                            dataKey="qqqValue"
                                            name="NASDAQ 100"
                                            stroke="#FF9800"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={styles.controlsSection}>
                        <div className={styles.controlGroup}>
                            <h3 className={styles.subsectionTitle}>Configuration</h3>
                            <div className={styles.timeframeSelector}>
                                {timeframes.map((timeframe) => (
                                    <button
                                        key={timeframe.value}
                                        className={`${styles.timeframeButton} ${selectedTimeframe === timeframe.value ? styles.selected : ""}`}
                                        onClick={() => setSelectedTimeframe(timeframe.value)}
                                    >
                                        {timeframe.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {chartData.length > 0 && (
                            <div className={styles.metrics}>
                                <h3 className={styles.subsectionTitle}>Results</h3>
                                <div className={styles.metric}>
                                    <span>Initial Value:</span>
                                    <span>{formatPrice(10000)}</span>
                                </div>
                                <div className={styles.metric}>
                                    <span>Current Value:</span>
                                    <span>{formatPrice(chartData[chartData.length - 1].value)}</span>
                                </div>
                                <div className={styles.metric}>
                                    <span>Total Return:</span>
                                    <span className={chartData[chartData.length - 1].value >= 10000 ? styles.positive : styles.negative}>
                                        {formatLargeNumber(Number(((chartData[chartData.length - 1].value / 10000 - 1) * 100).toFixed(2)))}%
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className={styles.controlGroup}>
                            <h3 className={styles.subsectionTitle}>Benchmarks</h3>
                            <div className={styles.benchmarkSelector}>
                                <button
                                    className={`${styles.timeframeButton} ${showSpy ? styles.selected : ""}`}
                                    onClick={() => setShowSpy(!showSpy)}
                                >
                                    S&P 500
                                </button>
                                <button
                                    className={`${styles.timeframeButton} ${showQqq ? styles.selected : ""}`}
                                    onClick={() => setShowQqq(!showQqq)}
                                >
                                    NASDAQ 100
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}