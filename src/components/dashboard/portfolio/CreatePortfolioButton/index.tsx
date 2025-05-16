import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

interface CreatePortfolioButtonProps {
  onCreatePortfolio: (name: string) => void;
}

export default function CreatePortfolioButton({ onCreatePortfolio }: CreatePortfolioButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [portfolioName, setPortfolioName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (portfolioName.trim()) {
      onCreatePortfolio(portfolioName.trim());
      setPortfolioName('');
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={portfolioName}
          onChange={(e) => setPortfolioName(e.target.value)}
          placeholder="Portfolio Name"
          className="px-4 py-2 border rounded"
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create
        </button>
        <button
          type="button"
          onClick={() => setIsCreating(false)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsCreating(true)}
      className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
    >
      <FaPlus />
      <span>New Portfolio</span>
    </button>
  );
} 