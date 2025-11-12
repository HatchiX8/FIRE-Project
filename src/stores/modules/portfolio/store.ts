// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import { getSummaryData, getHoldingsData } from '@/views/App/portfolio/api/index';
// 共用型別
import type { summaryData, StockRow } from '@/views/App/portfolio/api/index';
// 元件
// 商業邏輯
// import { getErrorMessage } from '@/utils/api/apiErrorMessage';
// store
import { useAreaLoadingStore } from '@/components/modules/loadingModule/store/index';

// --------------------------

export const usePortfolioStore = defineStore('portfolio', () => {
  // -------------------------------

  const loading = useAreaLoadingStore();
  const error = ref<string | null>(null);

  // ----------資產配置----------
  const summaryLoading = 'useSummaryLoading';
  const summaryList = ref<summaryData>({} as summaryData);

  const fetchSummaryData = async () => {
    loading.start(summaryLoading);
    error.value = null;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await getSummaryData();
      if (res.status) {
        summaryList.value = res.data;
        console.log('檢視API回傳', summaryList.value);
      } else {
        error.value = res.message || '取得資產配置失敗';
      }
    } catch (err) {
      console.log(err);
    } finally {
      loading.stop(summaryLoading);
    }
  };
  // ---------------------------

  // ----------持股配置----------
  const holdingsLoading = 'useHoldingsLoading';
  const holdingsList = ref<StockRow[]>([]);
  const holdingsPagination = ref({
    total_page: 0,
    current_page: 0,
  });

  const fetchHoldingsData = async (page: number) => {
    loading.start(holdingsLoading);
    error.value = null;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await getHoldingsData(page);
      if (res.status) {
        holdingsList.value = res.data.shareholding;
        holdingsPagination.value = res.data.pagination;
        console.log('檢視API回傳', holdingsList.value);
      } else {
        error.value = res.message || '取得持股配置失敗';
      }
    } catch (err) {
      console.log(err);
    } finally {
      loading.stop(holdingsLoading);
    }
  };
  // ---------------------------

  return {
    // ------------資產配置------------
    summaryList,
    fetchSummaryData,
    summaryLoading,
    // -------------------------------
    // ------------持股配置------------
    holdingsLoading,
    holdingsList,
    fetchHoldingsData,
    holdingsPagination,
    // -------------------------------
  };
});
