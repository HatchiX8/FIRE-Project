// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import { getUserList } from '@/api/index';
// 共用型別
import type { userInfo } from '@/api/index';
// 元件
// 商業邏輯
import { getErrorMessage } from '@/utils/index';
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
    error.value = null;
    try {
      const res = await getUserList();
      userInfo.value = res.data;

      const fakeToken = userInfo.value.token;
      setToken(fakeToken);
    } catch (err) {
      error.value = getErrorMessage(err);
    }
  };

  // 寫入 token
  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem(TOKEN_KEY, newToken);
  };

  // 登出
  const logout = () => {
    token.value = null;
    userInfo.value = null;
    localStorage.removeItem(TOKEN_KEY);
  };

  return { userInfo, error, requestLogin, setToken, token, logout, isLoggedIn };
});
