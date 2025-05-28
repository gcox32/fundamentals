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
} from "recharts";
import { formatLargeNumber, formatPrice } from "@/src/lib/utilities/format";

interface BackTestingProps {
    portfolioHistoricalPrices: HistoricalPriceData[];
    weights: number[];
}

interface PortfolioValue {
    date: string;
    value: number;
}

const timeframes = [
  { value: "1Y", label: "1 Year" },
  { value: "3Y", label: "3 Years" },
  { value: "5Y", label: "5 Years" },
];

export default function BackTesting({portfolioHistoricalPrices, weights}: BackTestingProps)  {
    const [selectedTimeframe, setSelectedTimeframe] = useState("1Y");

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
        
        switch(selectedTimeframe) {
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
                const weightedValue = 10000 * (weights[index]/100) * (priceData.adjClose / startPriceData.adjClose);
                totalValue += weightedValue;
            });

            return hasAllPrices ? {
                date,
                value: totalValue,
            } : null;
        }).filter((item): item is PortfolioValue => item !== null);

        return portfolioValues;
    }, [portfolioHistoricalPrices, weights, selectedTimeframe]);

    return (
        <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Historical Performance</h2>
        <div className={styles.card}>
            <div className={styles.grid}>
                <div className={styles.subsection}>
                    <h3 className={styles.subsectionTitle}>Performance Metrics</h3>
                    <div className={styles.timeframeSelector}>
                        {timeframes.map((timeframe) => (
                            <button
                                key={timeframe.value}
                                className={`${styles.timeframeButton} ${
                                    selectedTimeframe === timeframe.value ? styles.selected : ""
                                }`}
                                onClick={() => setSelectedTimeframe(timeframe.value)}
                            >
                                {timeframe.label}
                            </button>
                        ))}
                    </div>
                    {chartData.length > 0 && (
                        <div className={styles.metrics}>
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
                </div>
                <div className={styles.subsection}>
                    <h3 className={styles.subsectionTitle}>Performance Chart</h3>
                    <div style={{ width: "100%", height: 400 }}>
                        <ResponsiveContainer>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
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
                                    formatter={(value: number) => [formatPrice(value), "Portfolio Value"]}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#2196F3"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}