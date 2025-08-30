import instance from '@/api/axios';
import type { userInfo, apiResponse } from './types';

export const getUserList = async () => {
  const res = await instance.get<apiResponse<userInfo>>('/api/v1/users/auth/google');
  return res.data;
};
