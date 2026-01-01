import instance, { requestApi } from '@/api/axios';
import type { ApiResult, ApiBody } from '@/api/type';
import type { userInfo } from './types';

// 登入
export const login = (): Promise<ApiResult<userInfo>> =>
  requestApi<userInfo>(() => instance.get<ApiBody<userInfo>>('/api/v1/user/auth/google'));

// 驗證登入狀態
export const loginCheck = (): Promise<ApiResult<userInfo>> =>
  requestApi<userInfo>(() => instance.get<ApiBody<userInfo>>('/api/v1/user/check'));

// refresh cookie
export const refreshCookie = (): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.post<ApiBody<null>>('/api/v1/user/refresh'));

export const logout = (): Promise<ApiResult<null>> =>
  requestApi<null>(() => instance.post<ApiBody<null>>('/api/v1/user/logout'));
