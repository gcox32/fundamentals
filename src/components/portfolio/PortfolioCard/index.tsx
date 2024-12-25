import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import styles from './styles.module.css';

const client = generateClient<Schema>();

type Position = {
  id: string;
  portfolioId: string;
  symbol: string;
  quantity: number;
  costBasis: number;
  createdAt: string;
  updatedAt: string;
};

interface Portfolio {
  id: string;
  name: string;
  positions: {
    items: Position[];
  };
}

interface PortfolioCardProps {
  portfolio: Portfolio;
  onDelete: (id: string) => void;
}

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
          onClick={() => onDelete(portfolio.id)}
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
        ) : positions.map((position) => (
          <div key={position.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <div>
              <div className="font-medium">{position.symbol}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {position.quantity} shares @ ${position.costBasis.toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => handleDeletePosition(position.id)}
              className="text-red-200 hover:text-red-500 transition-colors"
            >
              <FaTrash />
            </button>
          </div>
        ))}
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