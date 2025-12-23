import instance, { requestApi } from '@/api/axios';
import type { ApiResult, ApiBody } from '@/api/type';
import type { StockMeta } from './index';

// ----------取得股票數據----------

export const getStockMeta = (): Promise<ApiResult<StockMeta[]>> =>
  requestApi<StockMeta[]>(() => instance.get<ApiBody<StockMeta[]>>(`/api/v1/stockInfo`));

// -------------------------------
