import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '@/stores/index';
// import { handleApiError } from '@/utils/api/handleApiError';
import '@/pinia';
import type { ApiBody } from './type';

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

instance.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const userStore = useUserStore();
    const status = err?.response?.status as number | undefined;
    const originalConfig = err?.config as RetriableConfig | undefined;

    if (status === 401 && originalConfig) {
      // 避免 refresh 自己也被 401 觸發迴圈
      const url = String(originalConfig.url ?? '');
      const isRefreshEndpoint =
        url.includes('/auth/refresh') || url.includes('/api/v1/user/refresh');

      // 只 retry 一次
      if (originalConfig._retry || isRefreshEndpoint) {
        await userStore.requestLogout('expired').catch(() => undefined);
        return Promise.reject(err);
      }

      originalConfig._retry = true;

      // refresh lock：多個 401 共用同一個 refresh
      if (!refreshPromise) {
        refreshPromise = runRefreshOnce()
          .catch(() => false)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const ok = await refreshPromise;

      if (!ok) {
        await userStore.requestLogout('expired').catch(() => undefined);
        return Promise.reject(err);
      }

      // refresh 成功：重送原請求
      return instance(originalConfig);
    }

    return Promise.reject(err);
  }
);

export type TransportResult<T> =
  | { ok: true; status: number; data: T; message?: string }
  | { ok: false; status: number; message: string };
// API 請求包裝函式
export const requestApi = async <T>(
  task: () => Promise<AxiosResponse<ApiBody<T>>>
): Promise<TransportResult<T>> => {
  try {
    const res = await task();
    return {
      ok: true,
      status: res.status,
      data: res.data.data as T,
      message: res.data.message,
    };
  } catch (e) {
    const err = e as AxiosError<ApiBody<unknown>>;
    const status = err.response?.status ?? 0;
    const message = err.response?.data?.message ?? err.message ?? `Request failed (${status})`;
    return { ok: false, status, message };
  }
};

let refreshPromise: Promise<boolean> | null = null;

const runRefreshOnce = async (): Promise<boolean> => {
  const userStore = useUserStore();
  // 你 store 裡有 requestRefreshCookie()
  const res = await userStore.requestRefreshCookie();

  if (!res.success) return false;

  // 依你的 refresh 回傳結構取 token（你需要對齊這段）
  // 假設你的 refreshCookie() 回傳 ApiBody<{ accessToken: string }>
  // 或 ApiBody<{ tokens: { accessToken: string } }>
  const newToken = res.data;
  if (typeof newToken !== 'string' || newToken.trim() === '') return false;

  userStore.setToken(newToken);
  return true;
};

export default instance;
