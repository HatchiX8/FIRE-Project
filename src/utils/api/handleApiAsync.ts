import { getErrorMessage } from '@/utils/index';

interface apiResponse<T> {
  status: boolean;
  message?: string;
  data?: T;
}

type Result<T> = { success: true; data: T } | { success: false; message: string };
const ok = <T>(data: T): Result<T> => ({ success: true, data });
const fail = (message: string): Result<never> => ({ success: false, message });
export type LoadingLike<K extends string = string> = {
  start: (key: K) => void;
  stop: (key: K) => void;
};

const handleApiAsync = async <T, K extends string = string>(
  task: () => Promise<T>,
  options?: {
    loadingStore?: LoadingLike<K>;
    loadingKey?: K;
    target?: Ref<T>;
  }
): Promise<Result<T>> => {
  const loading = options?.loadingStore; // 接收傳入的store 不在工具函式內連接pinia
  try {
    if (loading && options?.loadingKey) loading.start(options.loadingKey);
    const data = await task();
    if (options?.target) {
      options.target.value = data;
    }

    return ok(data);
  } catch (err) {
    const msg = getErrorMessage(err);
    return fail(msg);
  } finally {
    if (loading && options?.loadingKey) loading.stop(options.loadingKey);
  }
};

export const handleApiResponse = <T, K extends string = string>(
  task: () => Promise<apiResponse<T>>,
  options?: {
    loadingStore?: LoadingLike<K>;
    loadingKey?: K;
    target?: Ref<T>;
  }
) =>
  handleApiAsync<T, K>(async () => {
    const api = await task();
    if (!api.status) throw new Error(api.message ?? 'Request failed');
    return api.data as T;
  }, options);
