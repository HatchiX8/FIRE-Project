// ----------資產配置----------
// 資產配置型別
export interface SummaryData {
  totalInvest: number;
  cashInvest: number;
  stockValue: number;
  stockCost: number;
  positionRatio: number;
  stockProfit: number;
  profitRate: number;
}
// ---------------------------

// ----------持股配置----------
// 持有股票API資料型別
export interface HoldingsData {
  shareholding: StockRow[];
  pagination: {
    total_page: number;
    current_page: number;
  };
}

// 持有股票資訊型別
export interface StockRow {
  assetId: string;
  stockId: string;
  stockName: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  marketValue: number;
  totalCost: number;
  stockProfit: number;
  profitRate: number;
  note?: string;
  buyDate: string;
}
// 編輯股票資訊型別
export interface EditStockPayload {
  stockId: string;
  buyPrice: number;
  quantity: number;
  totalCost: number;
  buyDate: string;
  note: string;
}
// ---------------------------
