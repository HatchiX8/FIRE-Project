// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import {
  getSummaryData,
  getHoldingsData,
  addStockData,
  editStockData,
  deleteStockData,
  sellStockData,
  investAdd,
  investWithdrawal,
  investDeposit,
  getTotalInvest,
} from '@/views/App/portfolio/api/index';
// 共用型別
import type {
  SummaryData,
  HoldingsData,
  StockRow,
  AddStockPayload,
  EditStockPayload,
  SellStockPayload,
} from '@/views/App/portfolio/api/index';
// 元件
// 商業邏輯
import { handleApi } from '@/utils/index';
// store
import { useAreaLoadingStore } from '@/modules/loadingModule/store/index';

// --------------------------

export const usePortfolioStore = defineStore('portfolio', () => {
  // ----------初始化----------
  const areaLoading = useAreaLoadingStore();
  // -------------------------

  // ----------資產一覽----------
  const summaryLoading = 'useSummaryLoading';
  const summaryList = ref<SummaryData>({} as SummaryData);

  const fetchSummaryData = async () =>
    await handleApi(() => getSummaryData(), {
      loadingStore: areaLoading,
      loadingKey: summaryLoading,
      target: summaryList,
    });
  // ---------------------------

  // ----------持股配置----------
  const holdingsLoading = 'useHoldingsLoading';
  const holdingsResponse = ref<HoldingsData>({} as HoldingsData);
  const holdingsList = ref<StockRow[]>([]);
  const holdingsPagination = ref({
    totalPage: 1,
    currentPage: 1,
  });

  const fetchHoldingsData = async (page: number) => {
    const res = await handleApi(() => getHoldingsData(page), {
      loadingStore: areaLoading,
      loadingKey: holdingsLoading,
      target: holdingsResponse,
    });

    if (res.success) {
      holdingsList.value = res.data?.shareholding ?? [];
      holdingsPagination.value = {
        totalPage: res.data?.pagination.total_page ?? 1,
        currentPage: res.data?.pagination.current_page ?? 1,
      };
    }

    return res;
  };
  // ---------------------------

  // ----------新增資產----------
  const addAssetLoading = 'useAddAssetLoading';

  const addAsset = async (payload: AddStockPayload) => {
    const res = await handleApi(() => addStockData(payload), {
      loadingStore: areaLoading,
      loadingKey: addAssetLoading,
    });

    return res;
  };
  // ---------------------------

  // ----------編輯資產----------
  const editAssetLoading = 'useEditAssetLoading';

  const editAsset = async (assetId: string, payload: EditStockPayload) => {
    const res = await handleApi(() => editStockData(assetId, payload), {
      loadingStore: areaLoading,
      loadingKey: editAssetLoading,
    });

    return res;
  };
  // ---------------------------

  // ----------刪除資產----------
  const deleteAssetLoading = 'useDeleteAssetLoading';

  const deleteAsset = async (assetId: string) => {
    const res = await handleApi(() => deleteStockData(assetId), {
      loadingStore: areaLoading,
      loadingKey: deleteAssetLoading,
    });

    return res;
  };
  // ---------------------------

  // ----------賣出資產----------
  const sellAssetLoading = 'useSellAssetLoading';

  const sellAsset = async (assetId: string, payload: SellStockPayload) => {
    const res = await handleApi(() => sellStockData(assetId, payload), {
      loadingStore: areaLoading,
      loadingKey: sellAssetLoading,
    });

    return res;
  };
  // ---------------------------

  // ----------資金操作----------
  // 取得總資金
  const totalInvest = ref<number>(0);
  const totalInvestResponse = ref<{ totalInvest: number }>({} as { totalInvest: number });
  const totalInvestLoading = 'useTotalInvestLoading';

  const fetchTotalInvest = async () => {
    const res = await handleApi(() => getTotalInvest(), {
      loadingStore: areaLoading,
      loadingKey: totalInvestLoading,
      target: totalInvestResponse,
    });

    if (res.success) {
      totalInvest.value = totalInvestResponse.value.totalInvest;
    }

    return res;
  };

  // 投入
  const investLoading = 'useInvestLoading';

  const addInvest = async (amount: number) => {
    const res = await handleApi(() => investAdd(amount), {
      loadingStore: areaLoading,
      loadingKey: investLoading,
    });

    return res;
  };

  // 提領
  const withdrawalInvest = async (amount: number) => {
    const res = await handleApi(() => investWithdrawal(amount), {
      loadingStore: areaLoading,
      loadingKey: investLoading,
    });

    return res;
  };

  // 重置
  const depositInvest = async (amount: number) => {
    const res = await handleApi(() => investDeposit(amount), {
      loadingStore: areaLoading,
      loadingKey: investLoading,
    });

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

    // ----------持股操作----------
    addAsset,
    addAssetLoading,
    editAsset,
    editAssetLoading,
    deleteAsset,
    deleteAssetLoading,
    sellAsset,
    sellAssetLoading,
    // ---------------------------

    // ----------資金操作----------
    totalInvest,
    totalInvestLoading,
    investLoading,
    fetchTotalInvest,
    addInvest,
    withdrawalInvest,
    depositInvest,
    // ---------------------------
  };
});
