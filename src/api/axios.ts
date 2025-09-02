import axios from 'axios';
import { useUserStore } from '@/stores/index';
import { handleApiError } from '@/utils/api/handleApiError';
import { pinia } from '@/pinia';

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
        userStore.logout(); // 登出
        loggingOut = false;
      }
      // 401 不再交給全域 handler，避免重複訊息
      return Promise.reject(err);
    }

    handleApiError(err); // 全局錯誤處理
    return Promise.reject(err);
  }
);

export default instance;
