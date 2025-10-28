import instance from '@/api/axios';
import type { apiResponse } from '@/api/type';
import type { TotalTradesData, TrendChartData } from './index';

// ----------損益概況資訊----------
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
