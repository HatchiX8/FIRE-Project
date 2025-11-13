import instance from '@/api/axios';
import type { apiResponse } from '@/api/type';
import type { SummaryData, HoldingsData, EditStockPayload } from './index';

// ----------取得使用者資金配置----------
export const getSummaryData = async () => {
  const res = await instance.get<apiResponse<SummaryData>>(`/api/v1/users/portfolio/summary`);
  return res.data;
};
// -------------------------------------

// ----------取得使用者股票配置----------
export const getHoldingsData = async (page: number) => {
  const res = await instance.get<apiResponse<HoldingsData>>(
    `/api/v1/users/portfolio/holdings?page=${page}`
  );
  return res.data;
};

export const editStockData = async (assetId: string, payload: EditStockPayload) => {
  const res = await instance.patch<apiResponse<null>>(
    `/api/v1/assets/edit-assets/${assetId}`,
    payload
  );
  return res.data;
};
// -------------------------------------
