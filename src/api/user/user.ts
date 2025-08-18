import axios from '@/api/axios';
import type { UserInfo } from './userType';

export const getUserList = async () => {
  const res = await axios.get<UserInfo[]>('/user/list');
  return res.data;
};
