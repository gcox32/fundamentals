export function calculateTTM<T extends { date: string }>(
  data: T[],
  valueKey: keyof T,
  periods = 4
): T[] {
  return data.map((current, index, array) => {
    if (index < periods - 1) return current;

    const ttmValue = array
      .slice(index - (periods - 1), index + 1)
      .reduce((sum, item) => sum + (Number(item[valueKey]) || 0), 0);

    return {
      ...current,
      [valueKey]: ttmValue
    };
  });
} 