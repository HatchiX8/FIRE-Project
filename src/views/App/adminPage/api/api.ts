import instance, { requestApi } from '@/api/axios';
import type { ApiResult, ApiBody } from '@/api/type';
import type { UserUpgradeRequest, UserMemberRequest, UserUpgradeReviewPayload } from './index';

// ----------管理者頁面----------
// 取得申請升級使用者列表
export const getUserUpgradeList = (): Promise<ApiResult<UserUpgradeRequest[]>> =>
  requestApi<UserUpgradeRequest[]>(() =>
    instance.get<ApiBody<UserUpgradeRequest[]>>(`/api/v1/admin/upgrade-requests`)
  );

// 取得使用者列表
export const getUserMemberList = (): Promise<ApiResult<UserMemberRequest[]>> =>
  requestApi<UserMemberRequest[]>(() =>
    instance.get<ApiBody<UserMemberRequest[]>>(`/api/v1/admin/member`)
  );

// 審核使用者升級申請
export const apiReviewUserUpgrade = (
  userId: string,
  payload: UserUpgradeReviewPayload
): Promise<ApiResult<null>> =>
  requestApi<null>(() =>
    instance.patch<ApiBody<null>>(`/api/v1/admin/upgrade-requests/${userId}/review`, payload)
  );

// -----------------------------
