import { getErrorMessage } from './apiErrorMessage';
import { notify } from '../feedback/notify';

type LoadingLike<K extends string = string> = {
  start: (key: K) => void;
  stop: (key: K) => void;
};

export type TransportResult<T> =
  | { ok: true; status: number; data: T; message?: string }
  | { ok: false; status: number; message: string };

export type ApiResult<T> =
  | { success: true; data: T; message: string }
  | { success: false; message: string };

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
