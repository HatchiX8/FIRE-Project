// ----------import----------
// 套件
// API
import { getUserUpgradeList, getUserMemberList } from '@/views/App/adminPage/api/index';
// 共用型別
import type { UserUpgradeRequest, UserMemberRequest } from '@/views/App/adminPage/api/index';
// 元件
// 商業邏輯
import { handleApiResponse } from '@/utils/index';
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
    await handleApiResponse(() => getUserUpgradeList(), {
      loadingStore: areaLoading,
      loadingKey: upgradeListLoading,
      target: upgradeList,
    });
  // -------------------------------

  // ----------取得使用者列表----------
  const memberList = ref<UserMemberRequest[]>([]);
  const memberListLoading = 'useMemberListLoading';

  const fetchUserMemberList = async () =>
    await handleApiResponse(() => getUserMemberList(), {
      loadingStore: areaLoading,
      loadingKey: memberListLoading,
      target: memberList,
    });
  // ---------------------------------

  return { upgradeList, fetchUserUpgradeList, memberList, fetchUserMemberList };
});
