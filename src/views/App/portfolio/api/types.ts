// 資產配置型別
export interface summaryData {
  totalInvest: number;
  cashInvest: number;
  stockValue: number;
  stockCost: number;
  positionRatio: number;
  stockProfit: number;
  profitRate: number;
}

// 持有股票API資料型別
export interface holdingsData {
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
  profitRate: number;
  note?: string;
  created_at: string;
  updated_at: string;
}
