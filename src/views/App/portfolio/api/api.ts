import instance from '@/api/axios';
import type { apiResponse } from '@/api/type';
import type { summaryData } from './index';

// ----------取得使用者資金配置----------
export const getSummaryData = async (userId: string) => {
  const res = await instance.get<apiResponse<summaryData>>(
    `/api/v1/users/${userId}/portfolio/summary`
  );
  return res.data;
};
// -------------------------------------
