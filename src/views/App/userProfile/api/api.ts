import instance, { requestApi } from '@/api/axios';
import type { ApiResult, ApiBody } from '@/api/type';
import type { userInfoData, updateUserInfoPayload } from './index';

// ----------個人中心----------
// 取得使用者資訊
export const getUserInfoData = (): Promise<ApiResult<userInfoData>> =>
  requestApi(() => instance.get<ApiBody<userInfoData>>(`/api/v1/users/info`));

// 編輯使用者資訊
export const updateUserInfoData = (data: updateUserInfoPayload): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.patch<ApiBody<null>>(`/api/v1/users/update`, data));

// 帳號升級申請
export const accountUpgradeRequest = (data: { note: string }): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.patch<ApiBody<null>>(`/api/v1/users/account-upgrade`, data));

// ---------------------------
