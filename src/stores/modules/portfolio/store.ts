// ----------import----------
// 套件
import { defineStore } from 'pinia';
// API
import {
  getSummaryData,
  getHoldingsData,
  editStockData,
  deleteStockData,
  sellStockData,
} from '@/views/App/portfolio/api/index';
// 共用型別
import type {
  SummaryData,
  HoldingsData,
  StockRow,
  EditStockPayload,
  SellStockPayload,
} from '@/views/App/portfolio/api/index';
// 元件
// 商業邏輯
import { handleApiResponse } from '@/utils/index';
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
    await handleApiResponse(() => getSummaryData(), {
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

  // ----------編輯資產----------
  const editAssetLoading = 'useEditAssetLoading';

  const editAsset = async (assetId: string, payload: EditStockPayload) => {
    const res = await handleApiResponse(() => editStockData(assetId, payload), {
      loadingStore: areaLoading,
      loadingKey: editAssetLoading,
    });

    return res;
  };
  // ---------------------------

  // ----------刪除資產----------
  const deleteAssetLoading = 'useDeleteAssetLoading';

  const deleteAsset = async (assetId: string) => {
    const res = await handleApiResponse(() => deleteStockData(assetId), {
      loadingStore: areaLoading,
      loadingKey: deleteAssetLoading,
    });

    return res;
  };
  // ---------------------------

  // ----------賣出資產----------
  const sellAssetLoading = 'useSellAssetLoading';

  const sellAsset = async (assetId: string, payload: SellStockPayload) => {
    const res = await handleApiResponse(() => sellStockData(assetId, payload), {
      loadingStore: areaLoading,
      loadingKey: sellAssetLoading,
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
    editAsset,
    deleteAsset,
    sellAsset,
    // ---------------------------
  };
});
