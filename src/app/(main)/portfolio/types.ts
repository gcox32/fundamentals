export interface Position {
    id: string;
    portfolioId: string;
    symbol: string;
    costBasis: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Portfolio {
    id: string;
    userId: string;
    name: string;
    positions: {
      items: Position[];
    };
    createdAt: string;
    updatedAt: string;
  }