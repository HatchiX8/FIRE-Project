import instance from '@/api/axios';
import type { apiResponse } from '@/api/type';
import type { NewReportPayload, EditReportPayload, TotalTradesData, TrendChartData } from './index';
// ----------損益概況資訊----------
// 取得損益概況資訊
export const getTotalTradesData = async (year: number, month: number, page: number) => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
    page: String(page),
  });
  const res = await instance.get<apiResponse<TotalTradesData>>(
    `/api/v1/dashboard/reports?${params.toString()}`
  );
  return res.data;
};
// -------------------------------

// ----------趨勢圖點位資料----------
// 取得損益概況趨勢資料
export const getTrendChartData = async (year: number) => {
  const params = new URLSearchParams({
    year: String(year),
  });
  const res = await instance.get<apiResponse<TrendChartData>>(
    `/api/v1/dashboard/trends?${params.toString()}`
  );
  return res.data;
};
// ---------------------------------

// ----------歷史資料操作----------
// 新增歷史資料
export const addReportData = async (payload: NewReportPayload) => {
  const res = await instance.post<apiResponse<null>>(`/api/v1/dashboard/new-reports`, payload);
  return res.data;
};

// 編輯歷史資料
export const editReportData = async (tradesId: string, payload: EditReportPayload) => {
  const res = await instance.patch<apiResponse<null>>(`/api/v1/dashboard/${tradesId}`, payload);
  return res.data;
};
// -------------------------------
