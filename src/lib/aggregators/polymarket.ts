import { Market, ParsedMarket } from "@/types/polymarket";

export async function fetchRecessionMarket(): Promise<ParsedMarket | null> {
    const currentYear = new Date().getFullYear();
    const apiUrl = 'https://gamma-api.polymarket.com/markets?closed=false&limit=50';

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        const markets: Market[] = data.markets ?? data;

        const target = markets.find(m =>
            m.active &&
            m.question.toLowerCase().includes('recession') &&
            m.question.includes(currentYear.toString())
        );

        if (!target) {
            console.warn(`No matching recession market found for ${currentYear}`);
            return null;
        }

        const outcomes: string[] = JSON.parse(target.outcomes);
        const prices: string[] = JSON.parse(target.outcomePrices);

        const yesIndex = outcomes.findIndex(o => o.toLowerCase() === 'yes');
        const noIndex = outcomes.findIndex(o => o.toLowerCase() === 'no');

        const yesPrice = yesIndex !== -1 ? parseFloat(prices[yesIndex]) : null;
        const noPrice = noIndex !== -1 ? parseFloat(prices[noIndex]) : null;

        return {
            id: target.id,
            question: target.question,
            description: target.description,
            outcomes: outcomes,
            outcomePrices: prices,
            endDate: target.endDate,
            startDate: target.startDate,
            updatedAt: target.updatedAt,
            volume: parseFloat(target.volume),
            liquidity: parseFloat(target.liquidity),
            image: target.image,
            yesPrice: yesPrice ?? 0,
            noPrice: noPrice ?? 0,
            slug: target.slug,
            spread: target.spread
        };
    } catch (err) {
        console.error('Error fetching or parsing recession market:', err);
        return null;
    }
}
