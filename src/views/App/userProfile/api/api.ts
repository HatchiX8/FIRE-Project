import instance from '@/api/axios';
import type { apiResponse } from '@/api/type';
import type { userInfoData } from './index';

// ----------取得使用者資金配置----------
export const getUserInfoData = async () => {
  const res = await instance.get<apiResponse<userInfoData>>(`/api/v1/users/info`);
  return res.data;
};
// -------------------------------------
