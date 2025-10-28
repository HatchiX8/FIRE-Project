// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import {
  getUserInfoData,
  updateUserInfoData,
  accountUpgradeRequest,
} from '@/views/App/userProfile/api/index';
// 共用型別
import type { userInfoData, updateUserInfoPayload } from '@/views/App/userProfile/api/index';
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
  };
  // -----------------------------------

  // ----------編輯個人資料----------
  const updateInfoLoading = 'updateUserInfoLoading';

  const editUpdateUserInfoData = async (data: updateUserInfoPayload) => {
    loading.start(updateInfoLoading);

    try {
      const res = await updateUserInfoData(data);
      if (res.status) {
        userInfo.value = { ...userInfo.value, ...data };
      } else {
        error.value = res.message || '更新使用者資料失敗';
      }
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      loading.stop(updateInfoLoading);
    }
  };
  // -------------------------------

  // ----------帳號升級升起----------
  const accountUpgradeLoading = 'accountUpgradeLoading';

  const sendAccountUpgradeRequest = async (note: string) => {
    loading.start(accountUpgradeLoading);

    try {
      const res = await accountUpgradeRequest({ note });
      if (res.status) {
        console.log('帳號升級申請成功');
      } else {
        error.value = res.message || '帳號升級申請失敗';
      }
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      loading.stop(accountUpgradeLoading);
    }
  };
  // -------------------------------

  return {
    // ----------個人資訊----------
    userInfoLoading,
    fetchUserInfoData,
    userInfo,
    // ---------------------------

    // ----------編輯資訊----------
    editUpdateUserInfoData,
    // ---------------------------

    // ----------帳號升級----------
    sendAccountUpgradeRequest,
    // ---------------------------
  };
});
