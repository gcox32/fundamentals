const PRINCIPLES: Record<string, string> = {
	'chris-hohn': `
Focus on activism, capital efficiency, and environmental impact. 
Prioritizes shareholder value through operational improvements and strong corporate governance.
Runs a concentrated, high-conviction portfolio with a preference for quality businesses.
Place the most weight on large allocations; small positions should rarely dominate the thesis.
`.trim(),

	'peter-lynch': `
Seeks growth at a reasonable price (GARP). 
Believes in investing in what you know and thoroughly understanding the business.
Prioritizes earnings growth, strong management, and undervalued companies in everyday industries.
Favor high-conviction names; do not overemphasize small speculative allocations.
`.trim(),

	'warren-buffett': `
Focuses on long-term value investing with a strong preference for wide economic moats.
Looks for durable competitive advantages, excellent management, and reasonable valuations.
Avoids speculative or trendy investments and favors patient, fundamentals-driven decisions.
Emphasize the largest positions when forming judgments; trim commentary on minor holdings.
`.trim(),

	'jim-simons': `
Relies on quantitative strategies and pattern recognition, not traditional fundamentals.
Uses statistical models and massive data sets to identify short-term inefficiencies.
Emphasizes rigor, secrecy, and mathematical precision in trading and risk management.
Focus attention on signal strength and portfolio weights; de-emphasize tail positions.
`.trim(),
};

export async function getInvestorPrinciples(investor: string): Promise<string> {
	if (!PRINCIPLES[investor]) throw new Error(`Unknown investor: ${investor}`);
	return PRINCIPLES[investor];
}
