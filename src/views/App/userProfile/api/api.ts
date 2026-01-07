import instance, { requestApi } from '@/api/axios';
import type { ApiBody } from '@/api/types';
import type { userInfoData, updateUserInfoPayload } from './index';

// ----------個人中心----------
// 取得使用者資訊
export const getUserInfoData = () =>
  requestApi(() => instance.get<ApiBody<userInfoData>>(`/api/v1/user/info`));

// 編輯使用者資訊
export const updateUserInfoData = (data: updateUserInfoPayload) =>
  requestApi<null>(() => instance.patch<ApiBody<null>>(`/api/v1/user/update`, data));

// 帳號升級申請
export const accountUpgradeRequest = (data: { upgradeReason: string }) =>
  requestApi<null>(() => instance.post<ApiBody<null>>(`/api/v1/user/account-upgrade`, data));

// ---------------------------
