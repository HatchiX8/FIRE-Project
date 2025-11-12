// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import { getTotalTradesData, getTrendChartData } from '@/views/App/profitOverview/api/index';
// 共用型別
import type { TradeItem, TrendChartData } from '@/views/App/profitOverview/api/index';
// 元件
// 商業邏輯
// import { getErrorMessage } from '@/utils/api/apiErrorMessage';
// store
import { useAreaLoadingStore } from '@/components/modules/loadingModule/store/index';
// --------------------------

export const useProfitOverviewStore = defineStore('profitOverview', () => {
  // ----------初始化----------
  const loading = useAreaLoadingStore();
  const error = ref<string | null>(null);
  // ---------------------------

  // ----------損益概況趨勢----------
  const trendChartLoading = 'useTrendChartLoading';
  const trendChartData = ref<TrendChartData>({
    period: [],
    pnl: [],
    netContribution: [],
    totalEquity: [],
  });

  const fetchTrendChartData = async (year: number) => {
    loading.start(trendChartLoading);
    error.value = null;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await getTrendChartData(year);
      if (res.status) {
        trendChartData.value = res.data;
        console.log('檢視API回傳', trendChartData.value);
      } else {
        error.value = res.message || '取得損益概況趨勢失敗';
      }
    } catch (err) {
      console.log(err);
    } finally {
      loading.stop(trendChartLoading);
    }
  };
  // -------------------------------

  // ----------損益概況資訊----------
  const totalTradesLoading = 'useTotalTradesLoading';
  const totalTradesList = ref<TradeItem[]>([]);

  const fetchTotalTradesData = async (year: number, month: number, page: number) => {
    loading.start(totalTradesLoading);
    error.value = null;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await getTotalTradesData(year, month, page);
      if (res.status) {
        totalTradesList.value = res.data.totalTrades;
        console.log('檢視API回傳', totalTradesList.value);
      } else {
        error.value = res.message || '取得損益概況失敗';
      }
    } catch (err) {
      console.log(err);
    } finally {
      loading.stop(totalTradesLoading);
    }
  };
  // -------------------------------

  return {
    // ----------趨勢圖資訊----------
    trendChartData,
    trendChartLoading,
    fetchTrendChartData,
    // -----------------------------

    // ----------損益概況資訊----------
    totalTradesList,
    fetchTotalTradesData,
    totalTradesLoading,
    // -------------------------------
  };
});
