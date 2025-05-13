export default function LeadingIndicators() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top-Level Summary Panel */}
      <section className="mb-8 p-6 bg-[var(--card-bg)] rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Macroeconomic Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg border-[var(--border-color)] bg-[var(--background)]">
            <h3 className="font-semibold text-[var(--text-secondary)]">Economic Status</h3>
            <p className="text-2xl font-bold text-[var(--text)]">Expansion</p>
          </div>
          <div className="p-4 border rounded-lg border-[var(--border-color)] bg-[var(--background)]">
            <h3 className="font-semibold text-[var(--text-secondary)]">Fear-Greed Index</h3>
            <p className="text-2xl font-bold text-[var(--text)]">65 - Greed</p>
          </div>
          <div className="p-4 border rounded-lg border-[var(--border-color)] bg-[var(--background)]">
            <h3 className="font-semibold text-[var(--text-secondary)]">Recession Probability</h3>
            <p className="text-2xl font-bold text-[var(--text)]">15%</p>
          </div>
        </div>
      </section>

      {/* Additional Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 border rounded-lg bg-[var(--card-bg)] border-[var(--border-color)] shadow">
          <h3 className="font-semibold text-[var(--text-secondary)]">Inflation Regime</h3>
          <p className="text-2xl font-bold text-[var(--text)]">Disinflation</p>
        </div>
        <div className="p-4 border rounded-lg bg-[var(--card-bg)] border-[var(--border-color)] shadow">
          <h3 className="font-semibold text-[var(--text-secondary)]">Rate Regime</h3>
          <p className="text-2xl font-bold text-[var(--text)]">Restrictive</p>
        </div>
        <div className="p-4 border rounded-lg bg-[var(--card-bg)] border-[var(--border-color)] shadow">
          <h3 className="font-semibold text-[var(--text-secondary)]">Consumer Sentiment</h3>
          <p className="text-2xl font-bold text-[var(--text)]">Improving</p>
        </div>
      </div>

      {/* Thematic Indicator Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Consumer Health */}
        <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Consumer Health</h2>
          <div className="space-y-4">
            {/* Placeholder for charts and metrics */}
            <div className="h-48 bg-[var(--background-secondary)] rounded flex items-center justify-center text-[var(--text-secondary)]">
              Chart: Personal Consumption Expenditures
            </div>
          </div>
        </section>

        {/* Business Health */}
        <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Business Health</h2>
          <div className="space-y-4">
            {/* Placeholder for charts and metrics */}
            <div className="h-48 bg-[var(--background-secondary)] rounded flex items-center justify-center text-[var(--text-secondary)]">
              Chart: ISM Manufacturing & Services PMI
            </div>
          </div>
        </section>

        {/* Inflation & Rates */}
        <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Inflation & Rates</h2>
          <div className="space-y-4">
            <div className="h-48 bg-[var(--background-secondary)] rounded flex items-center justify-center text-[var(--text-secondary)]">
              Chart: CPI & PPI Trends
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)]">Core CPI</h3>
                <p className="text-lg font-bold text-[var(--text)]">3.2%</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)]">Fed Funds Rate</h3>
                <p className="text-lg font-bold text-[var(--text)]">5.25-5.50%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Credit Markets */}
        <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Credit Markets</h2>
          <div className="space-y-4">
            <div className="h-48 bg-[var(--background-secondary)] rounded flex items-center justify-center text-[var(--text-secondary)]">
              Chart: Corporate Bond Spreads
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)]">IG Spread</h3>
                <p className="text-lg font-bold text-[var(--text)]">125 bps</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)]">HY Spread</h3>
                <p className="text-lg font-bold text-[var(--text)]">425 bps</p>
              </div>
            </div>
          </div>
        </section>

        {/* Market-Based Indicators */}
        <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Market-Based Indicators</h2>
          <div className="space-y-4">
            <div className="h-48 bg-[var(--background-secondary)] rounded flex items-center justify-center text-[var(--text-secondary)]">
              Chart: Yield Curve
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)]">2Y/10Y Spread</h3>
                <p className="text-lg font-bold text-[var(--text)]">-35 bps</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)]">VIX</h3>
                <p className="text-lg font-bold text-[var(--text)]">16.5</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sector Impact & Valuation Implications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Sector Impact Snapshot</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border-b border-[var(--border-color)]">
              <span className="text-[var(--text)]">Technology</span>
              <span className="text-green-600">🔺 Favorable</span>
            </div>
            <div className="flex items-center justify-between p-2 border-b border-[var(--border-color)]">
              <span className="text-[var(--text)]">Industrials</span>
              <span className="text-yellow-600">⚠️ Mixed</span>
            </div>
            <div className="flex items-center justify-between p-2 border-b border-[var(--border-color)]">
              <span className="text-[var(--text)]">Consumer Staples</span>
              <span className="text-red-600">🔻 Unfavorable</span>
            </div>
          </div>
        </section>

        <section className="p-6 bg-[var(--card-bg)] rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Valuation Implications</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
              <h3 className="font-semibold mb-2 text-[var(--text)]">Multiple Compression Risk</h3>
              <p className="text-[var(--text-secondary)]">{`P/E multiples typically compress when CPI > 4% and rates are restrictive`}</p>
            </div>
            <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
              <h3 className="font-semibold mb-2 text-[var(--text)]">Growth Expectations</h3>
              <p className="text-[var(--text-secondary)]">{`Leading indicators suggest moderate earnings growth potential`}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 