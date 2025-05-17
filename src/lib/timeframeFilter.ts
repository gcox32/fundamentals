import { timeframes } from '@/components/dashboard/research/valuation/TimeframeSelector/config';

export function filterDataByTimeframe<T extends { date: string }>(
  data: T[],
  timeframe: string
): T[] {
  const now = new Date();
  const cutoffDate = new Date();

  switch(timeframe) {
    case '1W':
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case '1M':
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case '3M':
      cutoffDate.setMonth(now.getMonth() - 3);
      break;
    case '6M':
      cutoffDate.setMonth(now.getMonth() - 6);
      break;
    case '1Y':
      cutoffDate.setFullYear(now.getFullYear() - 1);
      break;
    case '3Y':
      cutoffDate.setFullYear(now.getFullYear() - 3);
      break;
    case '5Y':
      cutoffDate.setFullYear(now.getFullYear() - 5);
      break;
    case 'YTD':
      cutoffDate.setMonth(0, 1); // January 1st of current year
      break;
    case 'ALL':
    default:
      return data;
  }

  return data.filter(item => new Date(item.date) >= cutoffDate);
} 