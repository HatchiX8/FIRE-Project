import instance from '@/api/axios';
import type { userInfo, apiResponse } from './types';

// 登入
export const login = async () => {
  const res = await instance.get<apiResponse<userInfo>>('/api/v1/users/auth/google');
  return res.data;
};

// 驗證登入狀態
export const loginCheck = async () => {
  const res = await instance.get<apiResponse<userInfo>>('/api/v1/users/check');
  return res.data;
};
