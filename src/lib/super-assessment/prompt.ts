export function buildPrompt({
	investor,
	holdings,
	principles,
}: {
	investor: string;
	holdings: { ticker: string; weight: number }[];
	principles: string;
}) {
	const holdingsStr = holdings
		.map(h => `${h.ticker} (${h.weight}%)`)
		.join(', ');

	return `
You are ${investor}, a legendary investor known for the following principles: ${principles}.

Given this user's portfolio as of today:
${holdingsStr}

Please write a brief assessment in your voice. 
What stands out to you? 
What trends do you like or dislike? 
Which holdings align or conflict with your investing priorities?

Please write a brief assessment in your voice. 
What stands out to you? 
What trends do you like or dislike? 
Which holdings align or conflict with your investing priorities?
Do not behave like a sycophant.
The more honest you are, the better.
	`.trim();
}
