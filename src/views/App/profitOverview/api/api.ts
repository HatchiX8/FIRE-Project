import instance, { requestApi } from '@/api/axios';
import type { ApiResult, ApiBody } from '@/api/type';
import type { NewReportPayload, EditReportPayload, TotalTradesData, TrendChartData } from './index';
// ----------損益概況資訊----------
// 取得損益概況資訊
export const getTotalTradesData = (): Promise<ApiResult<TotalTradesData>> =>
  requestApi(() => instance.get<ApiBody<TotalTradesData>>(`/api/v1/dashboard/reports`));
// -------------------------------

// ----------趨勢圖點位資料----------
// 取得損益概況趨勢資料
export const getTrendChartData = (year: number): Promise<ApiResult<TrendChartData>> =>
  requestApi(() =>
    instance.get<ApiBody<TrendChartData>>(
      `/api/v1/dashboard/trends?year=${encodeURIComponent(String(year))}`
    )
  );
// ---------------------------------

// ----------歷史資料操作----------
// 新增歷史資料
export const addReportData = (payload: NewReportPayload): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.post<ApiBody<null>>(`/api/v1/dashboard/new-reports`, payload));

// 編輯歷史資料
export const editReportData = (
  tradesId: string,
  payload: EditReportPayload
): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.patch<ApiBody<null>>(`/api/v1/dashboard/${tradesId}`, payload));

// 刪除歷史資料
export const deleteReportData = (tradesId: string): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.delete<ApiBody<null>>(`/api/v1/dashboard/${tradesId}`));
// -------------------------------

// ----------資金操作----------
// 投入
export const investDeposit = (): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.post<ApiBody<null>>(`/api/v1/users/update/totalInvest/deposit`));

// 提領
export const investWithdrawal = (): Promise<ApiResult<null>> =>
  requestApi<null>(() =>
    instance.post<ApiBody<null>>(`/api/v1/users/update/totalInvest/withdrawal`)
  );

// ---------------------------
