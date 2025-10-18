// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import { getSummaryData } from '@/views/App/portfolio/api/index';
// 共用型別
import type { summaryData } from '@/views/App/portfolio/api/index';
// 元件
// 商業邏輯
import { getErrorMessage } from '@/utils/api/apiErrorMessage';
// store
import { useAreaLoadingStore } from '@/components/modules/loadingModule/store/index';
import { useUserStore } from '@/stores/modules/user/store';
// --------------------------

export const usePortfolioStore = defineStore('portfolio', () => {
  // ----------登入id初始化----------
  const userStore = useUserStore();
  const userId = computed(() => userStore.userInfo?.user.id || '');
  // -------------------------------

  const loading = useAreaLoadingStore();
  const error = ref<string | null>(null);

  // ----------資產配置----------
  const summaryLoading = 'useSummaryLoading';
  const summaryList = ref<summaryData>({} as summaryData);

  const fetchSummaryData = async () => {
    if (!userId.value) {
      error.value = '使用者尚未登入或ID無效';
      return;
    }

    loading.start(summaryLoading);
    error.value = null;

    try {
      const res = await getSummaryData(userId.value);
      if (res.status) {
        summaryList.value = res.data;
        console.log('檢視API回傳', summaryList.value);
      } else {
        error.value = res.message || '取得資產配置失敗';
      }
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      loading.stop(summaryLoading);
    }
  };
  // ---------------------------

  return {
    // ------------資產配置------------
    summaryList,
    fetchSummaryData,
    summaryLoading,
    // --------------------------------
  };
});
