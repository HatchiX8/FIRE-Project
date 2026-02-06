import instance, { requestApi } from '@/api/axios';
import type { ApiBody } from '@/api/types';
import type {
  UserUpgradeRequest,
  UserMemberRequest,
  UserUpgradeReviewPayload,
  UserActivationPayload,
} from './index';

// ----------管理者頁面----------
// 取得申請升級使用者列表
export const getUserUpgradeList = () =>
  requestApi<UserUpgradeRequest[]>(() =>
    instance.get<ApiBody<UserUpgradeRequest[]>>(`/api/v1/admin/upgrade-requests`)
  );

// 取得使用者列表
export const getUserMemberList = () =>
  requestApi<UserMemberRequest[]>(() =>
    instance.get<ApiBody<UserMemberRequest[]>>(`/api/v1/admin/member`)
  );

// 審核使用者升級申請
export const apiReviewUserUpgrade = (userId: string, payload: UserUpgradeReviewPayload) =>
  requestApi<null>(() =>
    instance.patch<ApiBody<null>>(`/api/v1/admin/upgrade-requests/${userId}/review`, payload)
  );

// 會員資格操作
export const apiUserActivation = (userId: string, payload: UserActivationPayload) =>
  requestApi<null>(() =>
    instance.patch<ApiBody<null>>(`/api/v1/admin/users/${userId}/activation`, payload)
  );
// -----------------------------
