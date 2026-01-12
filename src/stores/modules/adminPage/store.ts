// ----------import----------
// 套件
// API
import {
  getUserUpgradeList,
  getUserMemberList,
  apiReviewUserUpgrade,
  apiUserActivation,
} from '@/views/App/adminPage/api/index';
// 共用型別
import type {
  UserUpgradeRequest,
  UserMemberRequest,
  UserUpgradeReviewPayload,
  UserActivationPayload,
} from '@/views/App/adminPage/api/index';
// 元件
// 商業邏輯
import { handleApi } from '@/utils/index';
// store
import { useAreaLoadingStore } from '@/modules/loadingModule/store/index';
// --------------------------

export const useAdminPageStore = defineStore('adminPage', () => {
  // ----------初始化----------
  const areaLoading = useAreaLoadingStore();
  // -------------------------

  // ----------取得申請者列表----------
  const upgradeList = ref<UserUpgradeRequest[]>([]);
  const upgradeListLoading = 'useUpgradeListLoading';

  const fetchUserUpgradeList = async () =>
    await handleApi(() => getUserUpgradeList(), {
      loadingStore: areaLoading,
      loadingKey: upgradeListLoading,
      target: upgradeList,
    });
  // -------------------------------

  // ----------取得使用者列表----------
  const memberList = ref<UserMemberRequest[]>([]);
  const memberListLoading = 'useMemberListLoading';

  const fetchUserMemberList = async () =>
    await handleApi(() => getUserMemberList(), {
      loadingStore: areaLoading,
      loadingKey: memberListLoading,
      target: memberList,
    });
  // ---------------------------------

  // ----------審核申請----------
  const reviewUserUpgradeLoading = 'reviewUserUpgradeLoading';

  const reviewUserUpgrade = async (userId: string, payload: UserUpgradeReviewPayload) =>
    await handleApi(() => apiReviewUserUpgrade(userId, payload), {
      loadingStore: areaLoading,
      loadingKey: reviewUserUpgradeLoading,
    });
  // ---------------------------

  // ----------會員資格----------
  const accountActivationLoading = 'userAccountActivationLoading';
  const userAccountActivation = (userId: string, payload: UserActivationPayload) =>
    handleApi(() => apiUserActivation(userId, payload), {
      loadingStore: areaLoading,
      loadingKey: accountActivationLoading,
    });

  // ---------------------------

  return {
    upgradeList,
    fetchUserUpgradeList,
    memberList,
    fetchUserMemberList,
    reviewUserUpgradeLoading,
    reviewUserUpgrade,
    userAccountActivation,
  };
});
