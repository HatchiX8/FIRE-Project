import axios, { AxiosError, type AxiosResponse } from 'axios';
import { useUserStore } from '@/stores/index';
// import { handleApiError } from '@/utils/api/handleApiError';
import { pinia } from '@/pinia';
import type { ApiResult, ApiBody } from './type';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

instance.interceptors.request.use((config) => {
  const userStore = useUserStore(pinia);
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }
  return config;
});

let loggingOut = false;

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      if (!loggingOut) {
        loggingOut = true;
        const userStore = useUserStore(pinia);
        try {
          userStore.logout('expired');
        } finally {
          loggingOut = false;
        }
      }
      // 401 不再交給全域 handler，避免重複訊息
      return Promise.reject(err);
    }

    // 這邊先註解起來，改用 handleApiResponse 回傳錯誤訊息
    // handleApiError(err); // 全局錯誤處理
    return Promise.reject(err);
  }
);

export const requestApi = async <T>(
  task: () => Promise<AxiosResponse<ApiBody<T>>>
): Promise<ApiResult<T>> => {
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

export default instance;
