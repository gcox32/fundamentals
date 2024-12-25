import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import type { Position, PortfolioCardProps } from '@/types/portfolio';
import { formatPrice } from '@/utils/format';

const client = generateClient<Schema>();

export default function PortfolioCard({ portfolio, onDelete }: PortfolioCardProps) {
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [newPosition, setNewPosition] = useState({ symbol: '', quantity: '', costBasis: '' });
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPositions();
  }, [portfolio.id]);

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Today</th>
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
                {positions.map((position) => (
                  <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 py-2">
                      <img 
                        src={`https://assets.letmedemo.com/public/fundamental/icons/companies/${position.symbol.replace('.', '')}.png`} 
                        alt={position.symbol}
                        className="w-6 h-6"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </td>
                    <td className="px-3 py-2 font-medium">{position.symbol}</td>
                    <td className="px-3 py-2">--</td>
                    <td className="px-3 py-2">--</td>
                    <td className="px-3 py-2">--</td>
                    <td className="px-3 py-2">--</td>
                    <td className="px-3 py-2">--</td>
                    <td className="px-3 py-2">{position.quantity}</td>
                    <td className="px-3 py-2">{formatPrice(position.costBasis)}</td>
                    <td className="px-3 py-2">--</td>
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