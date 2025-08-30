import instance from '@/api/axios';
import type { userInfo } from './types';

export const getUserList = async () => {
  const res = await instance.get<userInfo[]>('/api/v1/users/auth/google');
  return res.data;
};
