import type { AxiosError } from 'axios';
import { notify } from '@/utils/index';

export const handleApiError = (err: unknown) => {
  const error = err as AxiosError<{ message?: string }>;
  const status = error.response?.status;

  if (status === 403) {
    notify('error', '您沒有權限操作');
  } else if (status && status >= 500) {
    notify('error', '伺服器錯誤，請稍後再試');
  } else {
    notify('error', error.response?.data?.message || '未知錯誤');
  }
};
