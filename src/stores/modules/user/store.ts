// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import { login, loginCheck } from '@/api/index';
// 共用型別
import type { userInfo } from '@/api/index';
// 元件
// 商業邏輯
import { handleApiResponse, handleErrorMsg } from '@/utils/index';
// store

// --------------------------

export const useUserStore = defineStore('user', () => {
  const TOKEN_KEY = 'acc_token';

  const userInfo = ref<userInfo | null>(null);
  const error = ref<string | null>(null);
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY)); // 預設從 localStorage 拿

  // 是否登入狀態
  const isLoggedIn = computed(() => !!token.value);

  // 登入請求
  const requestLogin = async () => {
    const res = await handleApiResponse(() => login(), {
      loadingStore: undefined,
      loadingKey: 'useLoginLoading',
      target: userInfo,
    });
    if (userInfo.value?.token) {
      setToken(userInfo.value.token);
    }

    return res;
  };

  // 登入驗證請求
  const requestLoginCheck = async () =>
    await handleApiResponse(() => loginCheck(), {
      loadingStore: undefined,
      loadingKey: 'useLoginLoading',
      target: userInfo,
    });

  // 寫入 token
  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem(TOKEN_KEY, newToken);
  };

  // 登出
  const logout = (reason?: 'expired' | 'manual') => {
    token.value = null;
    userInfo.value = null;
    localStorage.removeItem(TOKEN_KEY);

    if (reason === 'expired') {
      handleErrorMsg('登入已過期，請重新登入');
    } else if (reason === 'manual') {
      handleErrorMsg('已成功登出');
    }
  };

  return { userInfo, error, requestLogin, requestLoginCheck, setToken, token, logout, isLoggedIn };
});
