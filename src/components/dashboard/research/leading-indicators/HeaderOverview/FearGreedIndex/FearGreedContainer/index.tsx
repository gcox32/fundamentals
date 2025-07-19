import React from 'react';
import FearGreedGauge from './FearGreedGauge';
import { FearGreedIndexData } from '../index';
import FearGreedInfoPanel from './FearGreedInfoPanel';
export default function FearGreedContainer({ data }: FearGreedIndexData) {
    return (
        <div className="flex flex-col gap-4 mb-4">
            <div className="flex justify-center w-full mx-auto gap-6 flex-wrap">
                {/* Gauge Section - 65% */}
                <FearGreedGauge score={parseInt(data.value)} />

                {/* Info List Section - 35% */}
                <div className="w-[30%] min-w-[250px]">
                    <FearGreedInfoPanel data={data} />
                </div>
            </div>
            <span className="text-sm text-gray-500 mx-14 mt-2 z-10">Last Updated: {new Date(data.lastUpdated as string).toLocaleString()}</span>
            <div className="max-w-4xl mx-auto px-6 text-sm leading-relaxed space-y-4">
                <h3 className="text-base font-semibold">What is the CNN Business Fear &amp; Greed Index?</h3>
                <p>
                    The Fear &amp; Greed Index is a way to gauge stock market movements and whether stocks are fairly priced.
                    The theory is based on the logic that excessive fear tends to drive down share prices, and too much greed tends to have the opposite effect.
                </p>

                <h3 className="text-base font-semibold">How is Fear &amp; Greed Calculated?</h3>
                <p>
                    The Fear &amp; Greed Index is a compilation of seven different indicators that measure some aspect of stock market behavior.
                    They are market momentum, stock price strength, stock price breadth, put and call options, junk bond demand, market volatility,
                    and safe haven demand.
                </p>
            </div>
            <p className="text-xs text-gray-400 text-right mt-4 mr-14">
                Source: <a href="https://www.cnn.com/markets/fear-and-greed" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">
                    CNN Fear &amp; Greed Index
                </a>
            </p>
        </div>
    );
}
