import instance, { requestApi } from '@/api/axios';
import type { ApiBody } from '@/api/types';
import type { userInfo } from './types';

// 登入
export const login = () =>
  requestApi<userInfo>(() => instance.get<ApiBody<userInfo>>('/api/v1/user/auth/google'));

// 驗證登入狀態
export const loginCheck = () =>
  requestApi<userInfo>(() => instance.get<ApiBody<userInfo>>('/api/v1/user/check'));

// refresh cookie
export const refreshCookie = () =>
  requestApi<null>(() => instance.post<ApiBody<null>>('/api/v1/user/refresh'));

export const logout = () =>
  requestApi<null>(() => instance.post<ApiBody<null>>('/api/v1/user/logout'));
