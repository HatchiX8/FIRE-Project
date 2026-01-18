import instance, { requestApi } from '@/api/axios';
import type { ApiBody } from '@/api/types';
import type { StockMeta } from './index';

// ----------取得股票數據----------

export const getStockMeta = () =>
  requestApi<StockMeta[]>(() => instance.get<ApiBody<StockMeta[]>>(`/api/v1/stock/stockInfo`));

// -------------------------------
