import instance from '@/api/axios';
import type { apiResponse } from '@/api/type';
import type { summaryData, holdingsData } from './index';

// ----------取得使用者資金配置----------
export const getSummaryData = async (userId: string) => {
  const res = await instance.get<apiResponse<summaryData>>(
    `/api/v1/users/${userId}/portfolio/summary`
  );
  return res.data;
};
// -------------------------------------

// ----------取得使用者股票配置----------
export const getHoldingsData = async (userId: string, page: number) => {
  const res = await instance.get<apiResponse<holdingsData>>(
    `/api/v1/users/${userId}/portfolio/holdings?page=${page}`
  );
  return res.data;
};
// -------------------------------------
