import StockSearchBar from "@/components/dashboard/StockSearchBar";

export default function Dashboard() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
          Company Research
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Search across multiple exchanges for real-time stock information
        </p>
        <StockSearchBar />
      </div>
    </main>
  );
} 