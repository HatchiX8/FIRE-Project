import { createDiscreteApi } from 'naive-ui';
import type { AxiosError } from 'axios';

const { message } = createDiscreteApi(['message']);

export const handleApiError = (err: unknown) => {
  const error = err as AxiosError<{ message?: string }>;
  const status = error.response?.status;

  if (status === 403) {
    message.error('您沒有權限操作');
  } else if (status && status >= 500) {
    message.error('伺服器錯誤，請稍後再試');
  } else {
    message.error(error.response?.data?.message || '未知錯誤');
  }
};
