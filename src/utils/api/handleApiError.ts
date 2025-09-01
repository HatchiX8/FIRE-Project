import { createDiscreteApi } from 'naive-ui';
import type { AxiosError } from 'axios';
import { useUserStore } from '@/stores/index';

const { message } = createDiscreteApi(['message']);

let loggingOut = false;

export const handleApiError = (err: unknown) => {
  const error = err as AxiosError<{ message?: string }>;
  const status = error.response?.status;

  if (status === 401) {
    // 防止多個請求同時回傳 401 時，重複觸發登出與導頁
    if (!loggingOut) {
      loggingOut = true;

      // 清除登入狀態
      const userStore = useUserStore();
      userStore.logout(); // 清 token / user
      message.error('登入已過期，請重新登入');

      loggingOut = false;
    }
    return;
  }

  if (status === 403) {
    message.error('您沒有權限操作');
  } else if (status && status >= 500) {
    message.error('伺服器錯誤，請稍後再試');
  } else {
    message.error(error.response?.data?.message || '未知錯誤');
  }
};
