// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import {
  getTotalTradesData,
  getTrendChartData,
  addReportData,
  editReportData,
  deleteReportData,
} from '@/views/App/profitOverview/api/index';
// 共用型別
import type {
  TotalTradesData,
  TradeItem,
  TrendChartData,
  NewReportPayload,
  EditReportPayload,
} from '@/views/App/profitOverview/api/index';
// 元件
// 商業邏輯
import { handleApi } from '@/utils/index';
// store
import { useAreaLoadingStore } from '@/modules/loadingModule/store/index';
// --------------------------

export const useProfitOverviewStore = defineStore('profitOverview', () => {
  // ----------初始化----------
  const areaLoading = useAreaLoadingStore();
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
    await handleApi(() => getTrendChartData(year), {
      loadingStore: areaLoading,
      loadingKey: trendChartLoading,
      target: trendChartData,
    });
  // -------------------------------

  // ----------損益概況資訊----------
  const totalTradesLoading = 'useTotalTradesLoading';
  const totalTradesResponse = ref<TotalTradesData | null>(null);
  const totalTradesList = ref<TradeItem[]>([]);

  const fetchTotalTradesData = async (year: number, month: number, page: number) => {
    const res = await handleApi(() => getTotalTradesData(year, month, page), {
      loadingStore: areaLoading,
      loadingKey: totalTradesLoading,
      target: totalTradesResponse,
    });

    if (res.success) {
      totalTradesList.value = res.data?.totalTrades ?? [];
    }

    return res;
  };
  // -------------------------------

  // ----------新增資產----------
  const addReportLoading = 'useAddReportLoading';

  const addReport = async (payload: NewReportPayload) => {
    const res = await handleApi(() => addReportData(payload), {
      loadingStore: areaLoading,
      loadingKey: addReportLoading,
    });

    return res;
  };
  // ---------------------------

  // ----------編輯資產----------
  const editReportLoading = 'useEditReportLoading';

  const editReport = async (tradesId: string, payload: EditReportPayload) => {
    const res = await handleApi(() => editReportData(tradesId, payload), {
      loadingStore: areaLoading,
      loadingKey: editReportLoading,
    });

    return res;
  };
  // ---------------------------

  // ----------刪除資產----------
  const deleteReportLoading = 'useDeleteReportLoading';

  const deleteReport = async (tradesId: string) => {
    const res = await handleApi(() => deleteReportData(tradesId), {
      loadingStore: areaLoading,
      loadingKey: deleteReportLoading,
    });

    return res;
  };
  // ---------------------------

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

    // ----------歷史資料操作----------
    addReport,
    editReport,
    deleteReport,
    // -------------------------------
  };
});
