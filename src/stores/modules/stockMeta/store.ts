// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import { getStockMeta } from '@/api/stockMeta/index';
// 共用型別
import type { StockMeta } from '@/api/stockMeta/index';
// 元件
// 商業邏輯
import { handleApi } from '@/utils/index';
// store
// --------------------------

export const useStockMetaStore = defineStore('stockMeta', () => {
  const stocks = ref<StockMeta[]>([]); // 股票資訊

  // ----------取得股票資訊----------
  const fetchStockMeta = async () => {
    await handleApi(() => getStockMeta(), {
      target: stocks,
    });
  };
  // -------------------------------

  return { stocks, fetchStockMeta };
});
