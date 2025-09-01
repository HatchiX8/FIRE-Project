import axios from 'axios';
import { useUserStore } from '@/stores/index';
import { handleApiError } from '@/utils/index';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
  (err) => {
    handleApiError(err); // 全局錯誤處理
    return Promise.reject(err);
  }
);

export default instance;
