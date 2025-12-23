import instance, { requestApi } from '@/api/axios';
import type { ApiResult, ApiBody } from '@/api/type';
import type { userInfo } from './types';

// 登入
export const login = (): Promise<ApiResult<userInfo>> =>
  requestApi<userInfo>(() => instance.get<ApiBody<userInfo>>('/api/v1/users/auth/google'));

// 驗證登入狀態
export const loginCheck = (): Promise<ApiResult<userInfo>> =>
  requestApi<userInfo>(() => instance.get<ApiBody<userInfo>>('/api/v1/users/check'));
