import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import type { Position, PortfolioCardProps } from '@/types/portfolio';
import type { StockQuote } from '@/types/stock';
import { formatPrice } from '@/utils/format';
import PriceRangeIndicator from './PriceRangeIndicator';

const client = generateClient<Schema>();

export default function PortfolioCard({ portfolio, onDelete }: PortfolioCardProps) {
    const [isAddingPosition, setIsAddingPosition] = useState(false);
    const [newPosition, setNewPosition] = useState({ symbol: '', quantity: '', costBasis: '' });
    const [error, setError] = useState<string | null>(null);
    const [positions, setPositions] = useState<Position[]>([]);
    const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPositions();
    }, [portfolio.id]);

    useEffect(() => {
        if (positions.length > 0) {
            fetchQuotes();
        }
    }, [positions]);

    const fetchPositions = async () => {
        try {
            const { data } = await client.models.Position.list({
                filter: { portfolioId: { eq: portfolio.id } },
                authMode: 'userPool'
            });
            setPositions((data || []) as Position[]);
        } catch (err) {
            console.error('Error fetching positions:', err);
            setError('Failed to load positions');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchQuotes = async () => {
        try {
            const symbols = positions.map(p => p.symbol).join(',');
            const response = await fetch(`/api/stocks/quotes?symbols=${symbols}&portfolioId=${portfolio.id}`);
            if (!response.ok) throw new Error('Failed to fetch quotes');
            const data = await response.json();
            setQuotes(data);
        } catch (err) {
            console.error('Error fetching quotes:', err);
            setError('Failed to load quotes');
        }
    };

    const handleAddPosition = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const { data: newPos } = await client.models.Position.create({
                portfolioId: portfolio.id,
                symbol: newPosition.symbol.toUpperCase(),
                quantity: parseFloat(newPosition.quantity),
                costBasis: parseFloat(newPosition.costBasis)
            });

            if (newPos) {
                setPositions(prev => [...prev, newPos as Position]);
            }
            setNewPosition({ symbol: '', quantity: '', costBasis: '' });
            setIsAddingPosition(false);
        } catch (err) {
            console.error('Error adding position:', err);
            setError('Failed to add position');
        }
    };

    const handleDeletePosition = async (positionId: string) => {
        try {
            await client.models.Position.delete({
                id: positionId
            });
            setPositions(prev => prev.filter(p => p.id !== positionId));
        } catch (err) {
            console.error('Error deleting position:', err);
            setError('Failed to delete position');
        }
    };

    const calculatePortfolioStats = () => {
        const totalValue = positions.reduce((sum, pos) =>
            sum + (quotes[pos.symbol]?.price || 0) * pos.quantity, 0);

        const positionsWithStats = positions.map(position => {
            const value = (quotes[position.symbol]?.price || 0) * position.quantity;
            const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
            return { ...position, value, percentage };
        });

        return positionsWithStats.sort((a, b) => b.percentage - a.percentage);
    };

    return (
        <div className="dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-center w-full">{portfolio.name}</h3>
                <button
                    onClick={() => onDelete(portfolio)}
                    className="text-red-200 hover:text-red-500 transition-colors"
                >
                    <FaTrash />
                </button>
            </div>

            {error && (
                <div className="text-red-500 mb-4">{error}</div>
            )}

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-4">Loading positions...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Price</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Today G/L</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total G/L</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Portfolio</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Basis</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">52w Range</th>
                                    <th className="px-3 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {calculatePortfolioStats().map((position) => (
                                    <tr key={position.id} className="hover:bg-gray-300 dark:hover:bg-gray-600 group">
                                        {/* Company Logo */}
                                        <td className="px-3 py-2" style={{ minWidth: '60px' }}>
                                            <img
                                                src={`https://assets.letmedemo.com/public/fundamental/icons/companies/${position.symbol.replace('.', '')}.png`}
                                                alt={position.symbol}
                                                className="w-6 h-6"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        </td>
                                        {/* Symbol and Company Name */}
                                        <td className="px-3 py-2">
                                            <div className="flex flex-col">
                                                <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100">{position.symbol}</span>
                                                <span className="text-xs text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">{quotes[position.symbol]?.name}</span>
                                            </div>
                                        </td>
                                        {/* Last Price and Today's Change */}
                                        <td className="px-3 py-2">
                                            <div className="flex flex-col">
                                                <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100">
                                                    {formatPrice(quotes[position.symbol]?.price || 0)}
                                                </span>
                                                <span className={`font-medium ${quotes[position.symbol]?.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {quotes[position.symbol]?.change > 0 ? '+' : ''}
                                                    {formatPrice(quotes[position.symbol]?.change || 0)}
                                                </span>
                                            </div>
                                        </td>
                                        {/* Total Gain/Loss and % Gain/Loss */}
                                        <td className="px-3 py-2">
                                            <div className="flex flex-col">
                                                {(() => {
                                                    const quote = quotes[position.symbol];
                                                    if (!quote) return '--';
                                                    const todayGainLoss = (quote.price - quote.previousClose) * position.quantity;
                                                    const todayGainLossPercent = ((quote.price - quote.previousClose) / quote.previousClose) * 100;
                                                    return (
                                                        <>
                                                            <span className={`font-medium ${todayGainLoss > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                                {todayGainLoss > 0 ? '+' : ''}
                                                                {formatPrice(todayGainLoss)}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {todayGainLoss > 0 ? '+' : ''}
                                                                {todayGainLossPercent.toFixed(2)}%
                                                            </span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                        {/* Total Gain/Loss and % Gain/Loss */}
                                        <td className="px-3 py-2">
                                            <div className="flex flex-col">
                                                {(() => {
                                                    const quote = quotes[position.symbol];
                                                    if (!quote) return '--';
                                                    const totalGainLoss = (quote.price - position.costBasis) * position.quantity;
                                                    const totalGainLossPercent = ((quote.price - position.costBasis) / position.costBasis) * 100;
                                                    return (
                                                        <>
                                                            <span className={`font-medium ${totalGainLoss > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                                {totalGainLoss > 0 ? '+' : ''}
                                                                {formatPrice(totalGainLoss)}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {totalGainLoss > 0 ? '+' : ''}
                                                                {totalGainLossPercent.toFixed(2)}%
                                                            </span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                        {/* Total Value */}
                                        <td className="px-3 py-2">
                                            <div className="flex flex-col">
                                                <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100">
                                                    {formatPrice((quotes[position.symbol]?.price || 0) * position.quantity)}
                                                </span>
                                            </div>
                                        </td>
                                        {/* % of Portfolio */}
                                        <td className="px-3 py-2">
                                            <div className="flex flex-col">
                                                <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100">
                                                    {position.percentage.toFixed(2)}%
                                                </span>
                                            </div>
                                        </td>
                                        {/* Quantity */}
                                        <td className="px-3 py-2">
                                            <div className="flex flex-col">
                                                <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100">
                                                    {position.quantity}
                                                </span>
                                                <span className="text-xs text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                                    shares
                                                </span>
                                            </div>
                                        </td>
                                        {/* Cost Basis */}
                                        <td className="px-3 py-2">
                                            <div className="flex flex-col">
                                                <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100">
                                                    {formatPrice(position.costBasis * position.quantity)}
                                                </span>
                                                <span className="text-xs text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                                    {formatPrice(position.costBasis)} / share
                                                </span>
                                            </div>
                                        </td>
                                        {/* 52 Week Range */}
                                        <td className="px-3 py-2">
                                            {quotes[position.symbol] && (
                                                <PriceRangeIndicator
                                                    low={quotes[position.symbol].yearLow}
                                                    high={quotes[position.symbol].yearHigh}
                                                    current={quotes[position.symbol].price}
                                                />
                                            )}
                                        </td>
                                        {/* Delete Button */}
                                        <td className="px-3 py-2">
                                            <button
                                                onClick={() => handleDeletePosition(position.id)}
                                                className="text-red-200 hover:text-red-500 transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isAddingPosition ? (
                <form onSubmit={handleAddPosition} className="mt-4 space-y-3">
                    <input
                        type="text"
                        placeholder="Symbol (e.g., AAPL)"
                        value={newPosition.symbol}
                        onChange={(e) => setNewPosition(prev => ({ ...prev, symbol: e.target.value }))}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={newPosition.quantity}
                        onChange={(e) => setNewPosition(prev => ({ ...prev, quantity: e.target.value }))}
                        className="w-full p-2 border rounded"
                        required
                        min="0"
                        step="any"
                    />
                    <input
                        type="number"
                        placeholder="Cost Basis"
                        value={newPosition.costBasis}
                        onChange={(e) => setNewPosition(prev => ({ ...prev, costBasis: e.target.value }))}
                        className="w-full p-2 border rounded"
                        required
                        min="0"
                        step="any"
                    />
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAddingPosition(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setIsAddingPosition(true)}
                    className="mt-4 flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors"
                >
                    <FaPlus />
                    <span>Add Position</span>
                </button>
            )}
        </div>
    );
} 