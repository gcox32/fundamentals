export async function callOpenAI(prompt: string): Promise<string> {
	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			model: 'gpt-4o',
			messages: [{ role: 'user', content: prompt }],
			temperature: 0.7,
		}),
	});

	const json = await res.json();

	return json.choices?.[0]?.message?.content || 'No response';
}
