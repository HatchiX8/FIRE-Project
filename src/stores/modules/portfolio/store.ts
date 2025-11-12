// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import { getSummaryData, getHoldingsData } from '@/views/App/portfolio/api/index';
// 共用型別
import type { summaryData, holdingsData, StockRow } from '@/views/App/portfolio/api/index';
// 元件
// 商業邏輯
import { handleApiResponse } from '@/utils/index';
// store
import { useAreaLoadingStore } from '@/components/modules/loadingModule/store/index';

// --------------------------

export const usePortfolioStore = defineStore('portfolio', () => {
  // ----------初始化----------
  const areaLoading = useAreaLoadingStore();
  // -------------------------

  // ----------資產一覽----------
  const summaryLoading = 'useSummaryLoading';
  const summaryList = ref<summaryData>({} as summaryData);

  const fetchSummaryData = async () =>
    await handleApiResponse(() => getSummaryData(), {
      loadingStore: areaLoading,
      loadingKey: summaryLoading,
      target: summaryList,
    });
  // ---------------------------

  // ----------持股配置----------
  const holdingsLoading = 'useHoldingsLoading';
  const holdingsResponse = ref<holdingsData>({} as holdingsData);
  const holdingsList = ref<StockRow[]>([]);
  const holdingsPagination = ref({
    total_page: 0,
    current_page: 0,
  });

  const fetchHoldingsData = async (page: number) => {
    const res = await handleApiResponse(() => getHoldingsData(page), {
      loadingStore: areaLoading,
      loadingKey: holdingsLoading,
      target: holdingsResponse,
    });

    if (res.success) {
      holdingsList.value = res.data?.shareholding ?? [];
      holdingsPagination.value = res.data?.pagination ?? { total_page: 0, current_page: 0 };
    }

    return res;
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
