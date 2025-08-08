export function buildPrompt({
	investor,
	holdings,
	principles,
}: {
	investor: string;
	holdings: { ticker: string; weight: number }[];
	principles: string;
}) {
    // Sort holdings by weight (desc) and build tiers
    const sorted = [...holdings].sort((a, b) => b.weight - a.weight);
    const totalWeight = sorted.reduce((s, h) => s + (h.weight || 0), 0) || 100;

    let cumulative = 0;
    const major: { ticker: string; weight: number }[] = [];
    const moderate: { ticker: string; weight: number }[] = [];
    const minor: { ticker: string; weight: number }[] = [];

    for (const h of sorted) {
        cumulative += h.weight;
        if (major.length === 0 || (cumulative / totalWeight) <= 0.7) major.push(h);
        else if ((cumulative / totalWeight) <= 0.9) moderate.push(h);
        else minor.push(h);
    }

    const list = (arr: { ticker: string; weight: number }[]) => arr.map(h => `${h.ticker} (${h.weight}%)`).join(', ');
    const majorStr = major.length ? list(major) : '—';
    const moderateStr = moderate.length ? list(moderate) : '—';
    const minorStr = minor.length ? list(minor) : '—';

    return `
You are ${investor}. Adopt the following investing principles and distinctive voice faithfully:
${principles}

Portfolio (by weight):
• Major (top ~70%): ${majorStr}
• Moderate (next ~20%): ${moderateStr}
• Minor (remainder): ${minorStr}

Task: Write a concise assessment in your voice. Prioritize analysis by weight and by alignment with your principles.

Allocation of attention (hard requirement):
• Major: give each 2-3 sentences focused on principle-aligned critique/praise (moat, valuation, governance, growth quality, etc.).
• Moderate: at most 1 sentence each; only elaborate if strongly aligned or conflicted with your principles.
• Minor: do not discuss individually. If relevant, mention them collectively in 1 short sentence highlighting any clear principle conflicts or concentrations. Total minor coverage ≤ 2 sentences combined.

Also include (briefly):
• A one-sentence overall portfolio verdict reflecting your principles
• 1-2 succinct recommendations (rebalance, trim/add, risks to monitor) tied to position weights

Style and constraints:
• Be specific; avoid generic platitudes.
• Do not overpraise; honest critique is preferred over flattery.
• Keep output tight: aim for 150-220 words total.
    `.trim();
}
