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
import { handleApiResponse } from '@/utils/index';
// store
import { useAreaLoadingStore } from '@/modules/loadingModule/store/index';

// --------------------------

export const userInfoProfileStore = defineStore('userInfoProfile', () => {
  // ----------初始化----------
  const areaLoading = useAreaLoadingStore();

  // ---------------------------

  // ----------取得個人資料資訊----------
  const userInfoLoading = 'useUserInfoLoading';
  const userInfo = ref<userInfoData>({} as userInfoData);

  const fetchUserInfoData = async () =>
    await handleApiResponse(() => getUserInfoData(), {
      loadingStore: areaLoading,
      loadingKey: userInfoLoading,
      target: userInfo,
    });
  // -----------------------------------

  // ----------編輯個人資料----------
  const updateInfoLoading = 'updateUserInfoLoading';

  const editUpdateUserInfoData = async (data: updateUserInfoPayload) =>
    await handleApiResponse(() => updateUserInfoData(data), {
      loadingStore: areaLoading,
      loadingKey: updateInfoLoading,
    });
  // -------------------------------

  // ----------帳號升級升起----------
  const accountUpgradeLoading = 'accountUpgradeLoading';

  const sendAccountUpgradeRequest = async (note: string) =>
    await handleApiResponse(() => accountUpgradeRequest({ note }), {
      loadingStore: areaLoading,
      loadingKey: accountUpgradeLoading,
    });
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
