// ----------損益概況資訊----------
// API data 欄位型別
export interface TotalTradesData {
  totalTrades: TradeItem[];
  pagination: Pagination;
}

// 單筆交易型別
export interface TradeItem {
  tradesId: string;
  stockId: string;
  stockName: string;
  tradesDate: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  buyCost: number;
  actualRealizedPnl: number;
  stockProfit: number;
  profitLossRate: number;
  note: string;
}

// 分頁型別
export interface Pagination {
  total_page: number;
  current_page: number;
}
// -------------------------------

// ----------趨勢圖點位資料----------
export interface TrendChartData {
  period: string[];
  pnl: (number | null)[];
  netContribution: (number | null)[];
  totalEquity: (number | null)[];
}

// ---------------------------------
