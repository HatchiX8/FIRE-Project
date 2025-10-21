// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import { getUserInfoData } from '@/views/App/userProfile/api/index';
// 共用型別
import type { userInfoData } from '@/views/App/userProfile/api/index';
// 元件
// 商業邏輯
import { getErrorMessage } from '@/utils/api/apiErrorMessage';
// store
import { useAreaLoadingStore } from '@/components/modules/loadingModule/store/index';

// --------------------------

export const userInfoProfileStore = defineStore('userInfoProfile', () => {
  // ----------初始化----------
  const loading = useAreaLoadingStore();
  const error = ref<string | null>(null);

  // ---------------------------

  // ----------取得個人資料資訊----------
  const userInfoLoading = 'useUserInfoLoading';
  const userInfo = ref<userInfoData>({} as userInfoData);

  const fetchUserInfoData = async () => {
    loading.start(userInfoLoading);
    error.value = null;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await getUserInfoData();
      if (res.status) {
        userInfo.value = res.data;
        console.log('檢視API回傳', userInfo.value);
      } else {
        error.value = res.message || '取得使用者資料失敗';
      }
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      loading.stop(userInfoLoading);
    }
    // -----------------------------------
  };
  return {
    // ----------個人資訊----------
    userInfoLoading,
    fetchUserInfoData,
    userInfo,
    // ---------------------------
  };
});
