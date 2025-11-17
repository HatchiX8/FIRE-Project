import instance from '@/api/axios';
import type { apiResponse } from '@/api/type';
import type { StockMeta } from './index';

// ----------取得股票數據----------
export const getStockMeta = async () => {
  const res = await instance.get<apiResponse<StockMeta[]>>(`/api/v1/stockInfo`);
  return res.data;
};
// -------------------------------
