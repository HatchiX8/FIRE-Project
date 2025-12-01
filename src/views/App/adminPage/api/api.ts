import instance from '@/api/axios';
import type { apiResponse } from '@/api/type';
import type { UserUpgradeRequest } from './index';

// ----------管理者頁面----------
// 取得申請升級使用者列表
export const getUserUpgradeList = async () => {
  const res = await instance.get<apiResponse<UserUpgradeRequest[]>>(
    `/api/v1/admin/upgrade-requests`
  );
  return res.data;
};
// -----------------------------
