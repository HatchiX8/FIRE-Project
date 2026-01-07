import instance, { requestApi } from '@/api/axios';
import type { ApiBody } from '@/api/types';
import type { NewReportPayload, EditReportPayload, TotalTradesData, TrendChartData } from './index';
// ----------損益概況資訊----------
// 取得損益概況資訊
export const getTotalTradesData = (year: number, month: number, page: number) => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
    page: String(page),
  });
  return requestApi(() =>
    instance.get<ApiBody<TotalTradesData>>(`/api/v1/dashboard/reports?${params.toString()}`)
  );
};

// -------------------------------

// ----------趨勢圖點位資料----------
// 取得損益概況趨勢資料
export const getTrendChartData = (year: number) => {
  const params = new URLSearchParams({
    year: String(year),
  });
  return requestApi(() =>
    instance.get<ApiBody<TrendChartData>>(`/api/v1/dashboard/trends?${params.toString()}`)
  );
};

// ---------------------------------

// ----------歷史資料操作----------
// 新增歷史資料
export const addReportData = (payload: NewReportPayload) =>
  requestApi<null>(() => instance.post<ApiBody<null>>(`/api/v1/dashboard/new-reports`, payload));

// 編輯歷史資料
export const editReportData = (tradesId: string, payload: EditReportPayload) =>
  requestApi<null>(() => instance.patch<ApiBody<null>>(`/api/v1/dashboard/${tradesId}`, payload));

// 刪除歷史資料
export const deleteReportData = (tradesId: string) =>
  requestApi<null>(() => instance.delete<ApiBody<null>>(`/api/v1/dashboard/${tradesId}`));
// -------------------------------

// ----------資金操作----------
// 投入
export const investDeposit = (amount: number) =>
  requestApi<null>(() =>
    instance.post<ApiBody<null>>(`/api/v1/users/update/totalInvest/deposit`, { amount })
  );

// 提領
export const investWithdrawal = (amount: number) =>
  requestApi<null>(() =>
    instance.post<ApiBody<null>>(`/api/v1/users/update/totalInvest/withdrawal`, { amount })
  );

// ---------------------------
