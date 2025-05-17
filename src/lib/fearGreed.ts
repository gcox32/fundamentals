export async function fetchFearGreedIndex() {
    const res = await fetch('https://fear-and-greed-index.p.rapidapi.com/v1/fgi', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY!,
        'x-rapidapi-host': 'fear-and-greed-index.p.rapidapi.com',
      },
    });
  
    if (!res.ok) throw new Error('Failed to fetch Fear-Greed Index');
  
    const data = await res.json();
  
    return {
      value: `${data.fgi.now.value} - ${data.fgi.now.valueText}`,
      previous: data.fgi.previousClose,
      oneWeekAgo: data.fgi.oneWeekAgo,
      oneMonthAgo: data.fgi.oneMonthAgo,
      oneYearAgo: data.fgi.oneYearAgo,
      lastUpdated: data.lastUpdated.humanDate,
    };
  }
  