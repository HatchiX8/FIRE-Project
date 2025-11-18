// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import { getTotalTradesData, getTrendChartData } from '@/views/App/profitOverview/api/index';
// 共用型別
import type {
  TotalTradesData,
  TradeItem,
  TrendChartData,
} from '@/views/App/profitOverview/api/index';
// 元件
// 商業邏輯
import { handleApiResponse } from '@/utils/index';
// store
import { useAreaLoadingStore } from '@/modules/loadingModule/store/index';
// --------------------------

export const useProfitOverviewStore = defineStore('profitOverview', () => {
  // ----------初始化----------
  const loading = useAreaLoadingStore();
  // ---------------------------

  // ----------損益概況趨勢----------
  const trendChartLoading = 'useTrendChartLoading';
  const trendChartData = ref<TrendChartData>({
    period: [],
    pnl: [],
    netContribution: [],
    totalEquity: [],
  });

  const fetchTrendChartData = async (year: number) =>
    await handleApiResponse(() => getTrendChartData(year), {
      loadingStore: loading,
      loadingKey: trendChartLoading,
      target: trendChartData,
    });
  // -------------------------------

  // ----------損益概況資訊----------
  const totalTradesLoading = 'useTotalTradesLoading';
  const totalTradesResponse = ref<TotalTradesData | null>(null);
  const totalTradesList = ref<TradeItem[]>([]);

  const fetchTotalTradesData = async (year: number, month: number, page: number) => {
    const res = await handleApiResponse(() => getTotalTradesData(year, month, page), {
      loadingStore: loading,
      loadingKey: totalTradesLoading,
      target: totalTradesResponse,
    });

    if (res.success) {
      totalTradesList.value = res.data?.totalTrades ?? [];
    }

    return res;
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
