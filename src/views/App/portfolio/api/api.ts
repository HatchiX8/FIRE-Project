import instance from '@/api/axios';
import type { apiResponse } from '@/api/type';
import type { summaryData, holdingsData } from './index';

// ----------取得使用者資金配置----------
export const getSummaryData = async () => {
  const res = await instance.get<apiResponse<summaryData>>(`/api/v1/users/portfolio/summary`);
  return res.data;
};
// -------------------------------------

// ----------取得使用者股票配置----------
export const getHoldingsData = async (page: number) => {
  const res = await instance.get<apiResponse<holdingsData>>(
    `/api/v1/users/portfolio/holdings?page=${page}`
  );
  return res.data;
};
// -------------------------------------
