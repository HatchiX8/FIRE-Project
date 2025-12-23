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
  investDeposit,
  investWithdrawal,
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
import { handleApiResponse } from '@/utils/index';
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
    await handleApiResponse(() => getTrendChartData(year), {
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
    const res = await handleApiResponse(() => getTotalTradesData(year, month, page), {
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
    const res = await handleApiResponse(() => addReportData(payload), {
      loadingStore: areaLoading,
      loadingKey: addReportLoading,
    });

    return res;
  };
  // ---------------------------

  // ----------編輯資產----------
  const editReportLoading = 'useEditReportLoading';

  const editReport = async (tradesId: string, payload: EditReportPayload) => {
    const res = await handleApiResponse(() => editReportData(tradesId, payload), {
      loadingStore: areaLoading,
      loadingKey: editReportLoading,
    });

    return res;
  };
  // ---------------------------

  // ----------刪除資產----------
  const deleteReportLoading = 'useDeleteReportLoading';

  const deleteReport = async (tradesId: string) => {
    const res = await handleApiResponse(() => deleteReportData(tradesId), {
      loadingStore: areaLoading,
      loadingKey: deleteReportLoading,
    });

    return res;
  };
  // ---------------------------

  // ----------資金操作----------
  // 投入
  const investLoading = 'useInvestLoading';

  const deposit = async (amount: number) => {
    const res = await handleApiResponse(() => investDeposit(amount), {
      loadingStore: areaLoading,
      loadingKey: investLoading,
    });

    return res;
  };

  // 提領
  const withdrawal = async (amount: number) => {
    const res = await handleApiResponse(() => investWithdrawal(amount), {
      loadingStore: areaLoading,
      loadingKey: investLoading,
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

    // ----------資金操作----------
    deposit,
    withdrawal,
    // ---------------------------
  };
});
