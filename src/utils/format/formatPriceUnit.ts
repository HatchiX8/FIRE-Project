export const numberFormatter = new Intl.NumberFormat('zh-TW');

export const formatPriceUnit = (v: unknown): string => {
  const n = Number(v);
  return Number.isFinite(n) ? numberFormatter.format(n) : '';
};
