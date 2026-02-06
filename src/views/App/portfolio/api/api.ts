import instance, { requestApi } from '@/api/axios';
import type { ApiBody } from '@/api/types';
import type {
  SummaryData,
  HoldingsData,
  AddStockPayload,
  EditStockPayload,
  SellStockPayload,
} from './index';

// ----------取得使用者資金配置----------
export const getSummaryData = () =>
  requestApi(() => instance.get<ApiBody<SummaryData>>(`/api/v1/assets/portfolio/summary`));
// -------------------------------------

// ----------持股配置----------
// 取得使用者持股配置
export const getHoldingsData = (page: number) =>
  requestApi(() =>
    instance.get<ApiBody<HoldingsData>>(`/api/v1/assets/portfolio/holdings?page=${page}`)
  );

// 新增持股
export const addStockData = (payload: AddStockPayload) =>
  requestApi<null>(() => instance.post<ApiBody<null>>(`/api/v1/assets/new-asset`, payload));

// 編輯持股
export const editStockData = (assetId: string, payload: EditStockPayload) =>
  requestApi<null>(() => instance.patch<ApiBody<null>>(`/api/v1/assets/${assetId}`, payload));

// 刪除持股
export const deleteStockData = (assetId: string) =>
  requestApi<null>(() => instance.delete<ApiBody<null>>(`/api/v1/assets/${assetId}`));

// 賣出持股
export const sellStockData = (assetId: string, payload: SellStockPayload) =>
  requestApi<null>(() => instance.post<ApiBody<null>>(`/api/v1/assets/${assetId}`, payload));

// ---------------------------

// ----------資金操作----------
// 取得總資金
export const getTotalInvest = () =>
  requestApi(() => instance.get<ApiBody<{ totalInvest: number }>>(`/api/v1/user/totalInvest`));

export const investDeposit = (amount: number) =>
  requestApi<null>(() =>
    instance.post<ApiBody<null>>(`/api/v1/user/update/totalInvest/deposit`, { amount })
  );
// 投入
export const investAdd = (amount: number) =>
  requestApi<null>(() =>
    instance.post<ApiBody<null>>(`/api/v1/user/update/totalInvest/add`, { amount })
  );

// 提領
export const investWithdrawal = (amount: number) =>
  requestApi<null>(() =>
    instance.post<ApiBody<null>>(`/api/v1/user/update/totalInvest/withdrawal`, { amount })
  );
// ---------------------------
