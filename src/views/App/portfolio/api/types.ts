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

export interface AddStockPayload {
  stockId: string;
  buyPrice: number;
  quantity: number;
  buyCost: number;
  buyDate: string;
  note?: string;
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

export interface StockOption {
  stockId: string;
  stockName: string;
}

// 編輯股票資訊型別
export interface EditStockPayload {
  stock: StockOption;
  buyPrice: number;
  quantity: number;
  totalCost: number;
  buyDate: string;
  note: string;
}

// 賣出股票資訊型別
export interface SellStockPayload {
  sellPrice: number | null;
  sellQty: number | null;
  actualRealizedPnl: number | null;
  sellDate: string;
  note: string;
}
// ---------------------------

// ----------資金相關----------

// ---------------------------
