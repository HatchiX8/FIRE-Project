import instance, { requestApi } from '@/api/axios';
import type { ApiResult, ApiBody } from '@/api/type';
import type {
  SummaryData,
  HoldingsData,
  AddStockPayload,
  EditStockPayload,
  SellStockPayload,
} from './index';

// ----------取得使用者資金配置----------
export const getSummaryData = (): Promise<ApiResult<SummaryData>> =>
  requestApi(() => instance.get<ApiBody<SummaryData>>(`/api/v1/users/portfolio/summary`));
// -------------------------------------

// ----------持股配置----------
// 取得使用者持股配置
export const getHoldingsData = (): Promise<ApiResult<HoldingsData>> =>
  requestApi(() => instance.get<ApiBody<HoldingsData>>(`/api/v1/users/portfolio/holdings`));

// 新增持股
export const addStockData = (payload: AddStockPayload): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.post<ApiBody<null>>(`/api/v1/assets/new-asset`, payload));

// 編輯持股
export const editStockData = (
  assetId: string,
  payload: EditStockPayload
): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.patch<ApiBody<null>>(`/api/v1/assets/${assetId}`, payload));

// 刪除持股
export const deleteStockData = (assetId: string): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.delete<ApiBody<null>>(`/api/v1/assets/${assetId}`));

// 賣出持股
export const sellStockData = (
  assetId: string,
  payload: SellStockPayload
): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.post<ApiBody<null>>(`/api/v1/assets/${assetId}`, payload));

// ---------------------------
