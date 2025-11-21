export interface StockOptionLite {
  stockId?: string | null;
  stockName?: string | null;
}

/** 回傳 "id - name" 或單一存在的欄位，否則空字串 */
export const formatStockLabel = (stock?: StockOptionLite | null): string => {
  if (!stock) return '';
  const id = stock.stockId ?? '';
  const name = stock.stockName ?? '';
  return id && name ? `${id} - ${name}` : id || name || '';
};

/** 接受一個 Ref 或 computed，回傳一個 computed 字串供 template 綁定 */
export const useStockLabel = (stockRef: Ref<StockOptionLite | null | undefined>) => ({
  stockLabel: computed(() => formatStockLabel(stockRef.value)),
});
