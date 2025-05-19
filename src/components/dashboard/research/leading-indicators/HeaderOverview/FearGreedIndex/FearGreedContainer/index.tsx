import React from 'react';
import FearGreedGauge from './FearGreedGauge';
import { FearGreedIndexData } from '../index';

export default function FearGreedContainer({ data }: FearGreedIndexData) {
    const infoList = {
        previous: data.previous,
        oneWeekAgo: data.oneWeekAgo,
        oneMonthAgo: data.oneMonthAgo,
        oneYearAgo: data.oneYearAgo,
        lastUpdated: data.lastUpdated
    }
    return (
        <div className="flex justify-center w-full mx-auto gap-6">
            {/* Gauge Section - 65% */}
            <FearGreedGauge score={parseInt(data.value)} />

            {/* Info List Section - 35% */}
            <div className="w-[30%]">
                ...
            </div>
        </div>
    );
}
