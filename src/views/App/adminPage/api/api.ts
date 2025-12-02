import instance from '@/api/axios';
import type { apiResponse } from '@/api/type';
import type { UserUpgradeRequest, UserMemberRequest } from './index';

// ----------管理者頁面----------
// 取得申請升級使用者列表
export const getUserUpgradeList = async () => {
  const res = await instance.get<apiResponse<UserUpgradeRequest[]>>(
    `/api/v1/admin/upgrade-requests`
  );
  return res.data;
};

export const getUserMemberList = async () => {
  const res = await instance.get<apiResponse<UserMemberRequest[]>>(`/api/v1/admin/member`);
  return res.data;
};
// -----------------------------
