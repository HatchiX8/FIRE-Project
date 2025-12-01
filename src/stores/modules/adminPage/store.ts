// ----------import----------
// 套件
// API
import { getUserUpgradeList } from '@/views/App/adminPage/api/index';
// 共用型別
import type { UserUpgradeRequest } from '@/views/App/adminPage/api/index';
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

  return { upgradeList, fetchUserUpgradeList };
});
