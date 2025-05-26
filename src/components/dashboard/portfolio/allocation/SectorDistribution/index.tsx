import { useState } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CompanyProfile } from '@/types/company';
import styles from '@/components/common/Toggle/styles.module.css';
import clsx from 'clsx';
import { FaChartPie, FaChartBar } from 'react-icons/fa';

interface SectorDistributionProps {
    companyProfiles: CompanyProfile[];
    weights: Array<{
        ticker: string;
        weight: number;
    }>;
}

// Using a mix of our theme colors and complementary colors
const COLORS = [
    '#4F46E5', // Indigo
    '#3730A3', // Darker indigo
    '#2563EB', // Blue
    '#1D4ED8', // Darker blue
    '#7C3AED', // Purple
    '#6D28D9', // Darker purple
    '#EC4899', // Pink
    '#BE185D'  // Darker pink
];

export default function SectorDistribution({ companyProfiles, weights }: SectorDistributionProps) {
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

    // Calculate sector weights
    const sectorData = companyProfiles.reduce((acc, profile) => {
        const weight = weights.find(w => w.ticker === profile.symbol)?.weight || 0;
        const sector = profile.sector || 'Unknown';

        if (!acc[sector]) {
            acc[sector] = 0;
        }
        acc[sector] += weight;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(sectorData).map(([sector, weight]) => ({
        name: sector,
        value: weight
    }));

    return (
        <div className="w-[50%] h-[400px] min-w-[600px]">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-[var(--text)] w-full text-center">Sector Distribution</h3>

            </div>
            <ResponsiveContainer width="100%" height="100%">
                {chartType === 'pie' ? (
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {chartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    className="stroke-[var(--background)]"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
                            contentStyle={{
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text)',
                                fontSize: '12px'
                            }}
                        />
                    </PieChart>
                ) : (
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={50}
                            tick={{ fill: 'var(--text)', fontSize: 10 }}
                        />
                        <YAxis
                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                            tick={{ fill: 'var(--text)', fontSize: 10 }}
                        />
                        <Tooltip
                            formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
                            contentStyle={{
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text)',
                                fontSize: '12px'
                            }}
                        />
                        <Bar dataKey="value">
                            {chartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                )}
            </ResponsiveContainer>
            <div className={`${styles.toggleWrapper} w-[220px] my-[-3em] mx-auto`}>
                <button
                    onClick={() => setChartType('pie')}
                    className={clsx('flex', 'justify-center', 'items-center', 'w-3', 'h-6', styles.toggleButton, chartType === 'pie' ? styles.active : styles.inactive)}
                >
                    <FaChartPie />
                </button>
                <button
                    onClick={() => setChartType('bar')}
                    className={clsx('flex', 'justify-center', 'items-center', 'w-3', 'h-6', styles.toggleButton, chartType === 'bar' ? styles.active : styles.inactive)}
                >
                    <FaChartBar />
                </button>
                <div className={clsx(styles.slider, chartType === 'bar' ? styles.sliderRight : styles.sliderLeft)} />
            </div>
        </div>
    );
} 