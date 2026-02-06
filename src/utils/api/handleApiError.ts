import axios from 'axios';

export const handleApiError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    // 沒有 response，代表是網路 / 連線 / timeout
    if (!err.response) {
      return '無法連線至伺服器，請檢查網路狀態';
    }

    // 有 response 但被丟進 catch（極少見，當保險）
    return err.response.data?.message ?? '請求失敗';
  }

  if (err instanceof Error) {
    return err.message;
  }

  return '發生未知錯誤，請聯絡開發者';
};
