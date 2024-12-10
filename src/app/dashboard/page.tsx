import StockSearchBar from "@/components/dashboard/StockSearchBar";

export default function Dashboard() {
  return (
    <div 
      style={{
        backgroundImage: `linear-gradient(to bottom, var(--background-secondary), var(--background))`,
        borderRadius: '16px'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <StockSearchBar />
      </div>
    </div>
  );
} 