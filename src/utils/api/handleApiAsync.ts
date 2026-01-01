import { getErrorMessage } from './apiErrorMessage';
import { notify } from '../feedback/notify';

export type ApiResult<T> =
  | { ok: true; status: number; data: T; message?: string }
  | { ok: false; status: number; message: string };

type Result<T> = { success: true; data: T } | { success: false; message: string };
const ok = <T>(data: T): Result<T> => ({ success: true, data });
const fail = (message: string): Result<never> => ({ success: false, message });
type LoadingLike<K extends string = string> = {
  start: (key: K) => void;
  stop: (key: K) => void;
};

const handleApiAsync = async <T, K extends string = string>(
  task: () => Promise<T>,
  options?: {
    loadingStore?: LoadingLike<K>;
    loadingKey?: K;
    target?: Ref<T | undefined>;
  }
): Promise<Result<T>> => {
  const loading = options?.loadingStore; // 接收傳入的store 不在工具函式內連接pinia

  if (loading && options?.loadingKey) loading.start(options.loadingKey);

  if (import.meta.env.DEV) await new Promise((r) => setTimeout(r, 1000)); // 模擬載入時間

  try {
    const data = await task();
    if (options?.target && typeof data !== 'undefined') {
      options.target.value = data as T;
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
  task: () => Promise<ApiResult<T>>,
  options?: {
    loadingStore?: LoadingLike<K>;
    loadingKey?: K;
    target?: Ref<T | undefined>;
    notify?: boolean;
  }
) =>
  handleApiAsync<T | undefined, K>(async () => {
    const api = await task();

    if (!api.ok) {
      const shouldNotify = options?.notify ?? true;

      // 401 已由 interceptor -> logout('expired') 統一處理與提示，這裡排除避免重複
      if (shouldNotify && api.status !== 401) {
        if (api.status === 404) {
          notify('error', 'API請求異常，請確認');
        } else {
          notify('error', api.message);
        }
      }

      throw new Error(api.message);
    }

    // 成功：T 可能是 null（例如 ApiResult<null>），這裡直接回傳即可
    const data = api.data as T;

    // target 寫入：若你不想讓 null 覆蓋 target，可以保留 undefined 才不寫入的策略
    if (options?.target) {
      options.target.value = data as unknown as T;
    }

    return data;
  }, options);
