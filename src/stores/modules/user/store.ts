// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import { login, loginCheck, refreshCookie, logout } from '@/api/index';
// 共用型別
import type { userInfo } from '@/api/index';
// 元件
// 商業邏輯
import { handleApiResponse } from '@/utils/index';
import { notify } from '@/utils/index';
// store

// --------------------------

export const useUserStore = defineStore('user', () => {
  const TOKEN_KEY = 'acc_token';

  const userInfo = ref<userInfo | null>(null);
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

  // refresh cookie
  const requestRefreshCookie = async () =>
    await handleApiResponse(() => refreshCookie(), {
      loadingStore: undefined,
      loadingKey: 'useRefreshCookieLoading',
      target: token,
    });

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
  const requestLogout = async (reason?: 'expired' | 'manual') => {
    const res = await handleApiResponse(() => logout(), {
      loadingStore: undefined,
      loadingKey: 'useLogoutLoading',
    });

    if (res.success) {
      clearLoginState();
      if (reason === 'expired') {
        notify('warning', '登入已過期，請重新登入');
      } else if (reason === 'manual') {
        notify('success', '已成功登出');
      }
      return res;
    } else {
      // 登出失敗也強制清除資料
      clearLoginState();
      return res;
    }
  };

  const clearLoginState = () => {
    token.value = null;
    userInfo.value = null;
    meLoaded.value = false;
    localStorage.removeItem(TOKEN_KEY);
  };

  const meLoading = ref(false);
  const meLoaded = ref(false);

  const ensureMe = async () => {
    // 沒 token 就不用打
    if (!token.value) return { success: false, reason: 'no_token' as const };

    // 已經載過就不打
    if (meLoaded.value) return { success: true, reason: 'cached' as const };

    // 避免並發重複
    if (meLoading.value) return { success: true, reason: 'inflight' as const };

    meLoading.value = true;
    try {
      const res = await requestLoginCheck();
      if (res.success) {
        meLoaded.value = true;
      }
      return res;
    } finally {
      meLoading.value = false;
    }
  };

  return {
    userInfo,
    requestLogin,
    requestRefreshCookie,
    requestLoginCheck,
    setToken,
    token,
    requestLogout,
    isLoggedIn,
    ensureMe,
    meLoaded,
  };
});
