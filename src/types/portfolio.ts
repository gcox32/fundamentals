export type Position = {
    id: string;
    portfolioId: string;
    symbol: string;
    quantity: number;
    costBasis: number;
    createdAt: string;
    updatedAt: string;
  };
  
  export interface Portfolio {
    id: string;
    name: string;
    positions: {
      items: Position[];
    };
  }
  
  export interface PortfolioCardProps {
    portfolio: Portfolio;
    onDelete: (portfolio: Portfolio) => void;
  }