import instance from '@/api/axios';
import type { UserInfo } from './types';

export const getUserList = async () => {
  const res = await instance.get<UserInfo[]>('/user/list');
  return res.data;
};
