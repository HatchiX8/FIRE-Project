import { getErrorMessage } from './apiErrorMessage';
import { notify } from '../feedback/notify';
import type { TransportResult, ApiResult } from '@/api/index';

type LoadingLike<K extends string = string> = {
  start: (key: K) => void;
  stop: (key: K) => void;
};

export const handleApi = async <T, K extends string = string>(
  task: () => Promise<TransportResult<T>>,
  options?: {
    loadingStore?: LoadingLike<K>;
    loadingKey?: K;
    target?: Ref<T | undefined>;
    notify?: boolean;
  }
): Promise<ApiResult<T>> => {
  const loading = options?.loadingStore;
  if (loading && options?.loadingKey) loading.start(options.loadingKey);

  try {
    const api = await task();

    if (!api.ok) {
      if (options?.notify && api.status === 500) {
        notify('error', '伺服器錯誤，請通知管理員');
      }

      return {
        success: false,
        message: api.message,
      };
    }

    if (options?.target) {
      options.target.value = api.data;
    }

    return {
      success: true,
      data: api.data,
      message: api.message ?? '',
    };
  } catch (err) {
    return {
      success: false,
      message: getErrorMessage(err),
    };
  } finally {
    if (loading && options?.loadingKey) loading.stop(options.loadingKey);
  }
};
