import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import type { Position, PortfolioCardProps } from '@/types/portfolio';
import type { StockQuote } from '@/types/stock';
import { formatPrice } from '@/src/lib/format';
import PriceRangeIndicator from './PriceRangeIndicator';

const client = generateClient<Schema>();

type PositionWithStats = Position & {
    value: number;
    percentage: number;
};

export default function PortfolioCard({ portfolio, onDelete }: PortfolioCardProps) {
    const [isAddingPosition, setIsAddingPosition] = useState(false);
    const [newPosition, setNewPosition] = useState({ symbol: '', quantity: '', costBasis: '' });
    const [error, setError] = useState<string | null>(null);
    const [positions, setPositions] = useState<Position[]>([]);
    const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [editingPosition, setEditingPosition] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ quantity: '', costBasis: '' });
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc' | null;
    }>({ key: '', direction: null });

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
            const response = await fetch(`/api/research/valuation/stocks/quotes?symbols=${symbols}&portfolioId=${portfolio.id}`);
            if (!response.ok) throw new Error('Failed to fetch quotes');
            const data = await response.json();
            setQuotes(data);
        } catch (err) {
            console.error('Error fetching quotes:', err);
            setError('Failed to load quotes');
        }
    };

    const handleAddPosition = async () => {
        setError(null);

        if (!newPosition.symbol || !newPosition.quantity || !newPosition.costBasis) {
            setError('All fields are required');
            return;
        }

        try {
            const { data: newPos } = await client.models.Position.create({
                portfolioId: portfolio.id,
                symbol: newPosition.symbol.toUpperCase(),
                quantity: parseFloat(newPosition.quantity),
                costBasis: parseFloat(newPosition.costBasis)
            });

            if (newPos) {
                setPositions(prev => [...prev, newPos as unknown as Position]);
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

    const calculatePortfolioStats = (): PositionWithStats[] => {
        const totalValue = positions.reduce((sum, pos) =>
            sum + (quotes[pos.symbol]?.price || 0) * pos.quantity, 0);

        return positions.map(position => {
            const value = (quotes[position.symbol]?.price || 0) * position.quantity;
            const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
            return { ...position, value, percentage };
        }).sort((a, b) => b.percentage - a.percentage);
    };

    const handleEditPosition = async (positionId: string) => {
        setError(null);

        if (!editForm.quantity || !editForm.costBasis) {
            setError('All fields are required');
            return;
        }

        try {
            const { data: updatedPos } = await client.models.Position.update({
                id: positionId,
                quantity: parseFloat(editForm.quantity),
                costBasis: parseFloat(editForm.costBasis)
            });

            if (updatedPos) {
                setPositions(prev => prev.map(p => 
                    p.id === positionId ? { ...p, ...updatedPos as unknown as Position } : p
                ));
            }
            setEditingPosition(null);
            setEditForm({ quantity: '', costBasis: '' });
        } catch (err) {
            console.error('Error updating position:', err);
            setError('Failed to update position');
        }
    };

    const requestSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: 
                current.key === key && current.direction === 'asc' 
                    ? 'desc' 
                    : 'asc',
        }));
    };

    const SortableHeader = ({ label, sortKey }: { label: string; sortKey: string }) => (
        <th 
            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => requestSort(sortKey)}
        >
            <div className="flex items-center gap-1">
                {label}
                {sortConfig.key === sortKey && (
                    <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                )}
            </div>
        </th>
    );

    const sortData = (data: PositionWithStats[]) => {
        if (!sortConfig.key || !sortConfig.direction) return data;

        return [...data].sort((a, b) => {
            let aValue: number | string;
            let bValue: number | string;

            switch (sortConfig.key) {
                case 'symbol':
                    aValue = a.symbol;
                    bValue = b.symbol;
                    break;
                case 'price':
                    aValue = quotes[a.symbol]?.price || 0;
                    bValue = quotes[b.symbol]?.price || 0;
                    break;
                case 'todayGainLoss':
                    aValue = ((quotes[a.symbol]?.price || 0) - (quotes[a.symbol]?.previousClose || 0)) * a.quantity;
                    bValue = ((quotes[b.symbol]?.price || 0) - (quotes[b.symbol]?.previousClose || 0)) * b.quantity;
                    break;
                case 'totalGainLoss':
                    aValue = ((quotes[a.symbol]?.price || 0) - a.costBasis) * a.quantity;
                    bValue = ((quotes[b.symbol]?.price || 0) - b.costBasis) * b.quantity;
                    break;
                case 'value':
                    aValue = (quotes[a.symbol]?.price || 0) * a.quantity;
                    bValue = (quotes[b.symbol]?.price || 0) * b.quantity;
                    break;
                case 'percentage':
                    aValue = a.percentage;
                    bValue = b.percentage;
                    break;
                case 'quantity':
                    aValue = a.quantity;
                    bValue = b.quantity;
                    break;
                case 'costBasis':
                    aValue = a.costBasis * a.quantity;
                    bValue = b.costBasis * b.quantity;
                    break;
                case 'yearRange':
                    aValue = (quotes[a.symbol]?.price / quotes[a.symbol]?.yearHigh) * 100;
                    bValue = (quotes[b.symbol]?.price / quotes[b.symbol]?.yearHigh) * 100;
                    break;
                default:
                    aValue = 0;
                    bValue = 0;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
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
                                    <SortableHeader label="Symbol" sortKey="symbol" />
                                    <SortableHeader label="Last Price" sortKey="price" />
                                    <SortableHeader label="Today G/L" sortKey="todayGainLoss" />
                                    <SortableHeader label="Total G/L" sortKey="totalGainLoss" />
                                    <SortableHeader label="Value" sortKey="value" />
                                    <SortableHeader label="% of Portfolio" sortKey="percentage" />
                                    <SortableHeader label="Quantity" sortKey="quantity" />
                                    <SortableHeader label="Cost Basis" sortKey="costBasis" />
                                    <SortableHeader label="52w Range" sortKey="yearRange" />
                                    <th className="px-3 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {sortData(calculatePortfolioStats()).map((position) => (
                                    <tr key={position.id} className="hover:bg-gray-300 dark:hover:bg-gray-600 group">
                                        {/* Company Logo */}
                                        <td className="px-3 py-2" style={{ minWidth: '60px' }}>
                                            <img
                                                src={`https://assets.letmedemo.com/public/fundamental/icons/companies/${position.symbol.replace('.', '')}.png`}
                                                alt={position.symbol}
                                                className="w-6 h-6"
                                                onError={(e) => {
                                                    e.currentTarget.src = `https://storage.googleapis.com/iex/api/logos/${position.symbol}.png`;
                                                    e.currentTarget.onerror = () => {
                                                        e.currentTarget.style.display = 'none';
                                                    };
                                                }}
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
                                            {editingPosition === position.id ? (
                                                <input
                                                    type="number"
                                                    value={editForm.quantity}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, quantity: e.target.value }))}
                                                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                                                    required
                                                    min="0"
                                                    step="any"
                                                />
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100">
                                                        {position.quantity}
                                                    </span>
                                                    <span className="text-xs text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                                        shares
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        {/* Cost Basis */}
                                        <td className="px-3 py-2">
                                            {editingPosition === position.id ? (
                                                <input
                                                    type="number"
                                                    value={editForm.costBasis}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, costBasis: e.target.value }))}
                                                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                                                    required
                                                    min="0"
                                                    step="any"
                                                />
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100">
                                                        {formatPrice(position.costBasis * position.quantity)}
                                                    </span>
                                                    <span className="text-xs text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                                        {formatPrice(position.costBasis)} / share
                                                    </span>
                                                </div>
                                            )}
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
                                            <div className="flex gap-2">
                                                {editingPosition === position.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditPosition(position.id)}
                                                            className="text-green-500 hover:text-green-700 transition-colors"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingPosition(null);
                                                                setEditForm({ quantity: '', costBasis: '' });
                                                            }}
                                                            className="text-red-500 hover:text-red-700 transition-colors"
                                                        >
                                                            ✕
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingPosition(position.id);
                                                                setEditForm({
                                                                    quantity: position.quantity.toString(),
                                                                    costBasis: position.costBasis.toString()
                                                                });
                                                            }}
                                                            className="text-blue-200 hover:text-blue-500 transition-colors"
                                                        >
                                                            ✎
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePosition(position.id)}
                                                            className="text-red-200 hover:text-red-500 transition-colors"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {isAddingPosition ? (
                                    <tr className="hover:bg-gray-300 dark:hover:bg-gray-600">
                                        <td className="px-3 py-2" style={{ minWidth: '60px' }}></td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="text"
                                                placeholder="AAPL"
                                                value={newPosition.symbol}
                                                onChange={(e) => setNewPosition(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                                                className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                                                required
                                            />
                                        </td>
                                        <td className="px-3 py-2" colSpan={3}></td>
                                        <td className="px-3 py-2" colSpan={2}></td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="number"
                                                placeholder="Quantity"
                                                value={newPosition.quantity}
                                                onChange={(e) => setNewPosition(prev => ({ ...prev, quantity: e.target.value }))}
                                                className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                                                required
                                                min="0"
                                                step="any"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="number"
                                                placeholder="Cost/Share"
                                                value={newPosition.costBasis}
                                                onChange={(e) => setNewPosition(prev => ({ ...prev, costBasis: e.target.value }))}
                                                className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                                                required
                                                min="0"
                                                step="any"
                                            />
                                        </td>
                                        <td className="px-3 py-2" colSpan={1}></td>
                                        <td className="px-3 py-2">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleAddPosition}
                                                    className="text-green-500 hover:text-green-700 transition-colors"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => setIsAddingPosition(false)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="px-3 py-2">
                                            <button
                                                onClick={() => setIsAddingPosition(true)}
                                                className="w-full flex items-center justify-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors py-2"
                                            >
                                                <FaPlus />
                                                <span>Add Position</span>
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
} 