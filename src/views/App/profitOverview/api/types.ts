// ----------損益概況資訊----------
// API data 欄位型別
export interface TotalTradesData {
  totalTrades: TradeItem[];
  pagination: Pagination;
}

// 單筆交易型別
// export interface TradeItem {
//   tradesId: string;
//   stockId: string;
//   stockName: string;
//   tradesDate: string;
//   buyPrice: number;
//   sellPrice: number;
//   quantity: number;
//   buyCost: number;
//   actualRealizedPnl: number;
//   stockProfit: number;
//   profitLossRate: number;
//   note: string;
// }

export interface TradeItem {
  tradesId: string;
  stockId: string;
  stockName: string;
  buyPrice: number;
  quantity: number;
  buyCost: number;
  buyDate: string;
  buyNote?: string;
  sellPrice: number;
  sellQty: number;
  sellCost: number;
  realizedPnl: number;
  profitLossRate: number;
  sellDate: string;
  sellNote?: string;
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
  // netContribution: (number | null)[];
  // totalEquity: (number | null)[];
}

// ---------------------------------

// ----------表格欄位型別----------
// export interface StockRow {
//   tradesId: string;
//   stockId: string;
//   stockName: string;
//   tradesDate: string;
//   buyPrice: number;
//   sellPrice: number;
//   quantity: number;
//   buyCost: number;
//   actualRealizedPnl: number;
//   stockProfit: number;
//   profitLossRate: number;
//   note: string;
// }
export interface StockRow {
  tradesId: string;
  stockId: string;
  stockName: string;
  buyPrice: number;
  quantity: number;
  buyCost: number;
  buyDate: string;
  buyNote?: string;
  sellPrice: number;
  sellQty: number;
  sellCost: number;
  realizedPnl: number;
  sellDate: string;
  sellNote?: string;
}

export interface StockOption {
  stockId: string;
  stockName: string;
}
// ---------------------------

// ----------歷史資訊操作----------
// 新增歷史交易資料型別
export interface NewReportPayload {
  stockId: string;
  buyPrice: number;
  quantity: number;
  buyCost: number;
  buyDate: string;
  buyNote?: string;
  sellPrice: number;
  sellQty: number;
  sellCost: number;
  realizedPnl: number;
  sellDate: string;
  sellNote?: string;
}

// 編輯歷史交易資料型別
export interface EditReportPayload {
  stockId: string;
  sellPrice: number;
  sellQty: number;
  sellCost: number;
  realizedPnl: number;
  sellDate: string;
  sellNote?: string;
}

// 刪除歷史交易資料型別
// -------------------------------
