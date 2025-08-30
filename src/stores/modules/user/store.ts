// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
// 共用型別
import type { userInfo } from '@/api/user/types';
// 元件
// 商業邏輯
// store
// --------------------------

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<userInfo | null>(null);

  return { userInfo };
});
