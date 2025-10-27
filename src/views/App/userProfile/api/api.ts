import instance from '@/api/axios';
import type { apiResponse } from '@/api/type';
import type { userInfoData, updateUserInfoPayload } from './index';

// ----------個人中心----------
// 取得使用者資訊
export const getUserInfoData = async () => {
  const res = await instance.get<apiResponse<userInfoData>>(`/api/v1/users/info`);
  return res.data;
};

// 編輯使用者資訊
export const updateUserInfoData = async (data: updateUserInfoPayload) => {
  const res = await instance.patch<apiResponse<null>>(`/api/v1/users/update`, data);
  return res.data;
};

// 帳號升級申請
export const accountUpgradeRequest = async (data: { note: string }) => {
  const res = await instance.patch<apiResponse<null>>(`/api/v1/users/account-upgrade`, data);
  return res.data;
};
// ---------------------------
