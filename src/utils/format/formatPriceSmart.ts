export const formatPriceSmart = (value: number): string => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-';
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};
