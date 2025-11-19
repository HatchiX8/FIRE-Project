import { MockMethod } from 'vite-plugin-mock';
import {
  login,
  loginCheck,
  getStockInfo,
  getSummary,
  getHoldings,
  userInfoData,
  userUpdate,
  userAccountUpgrade,
  dashboardReports,
  dashboardTrendChart,
  addAssets,
  editAssets,
  deleteAssets,
  sellAssets,
} from './mockApi/index';

export default [
  // ----------使用者登入----------
  login, // 登入Api
  loginCheck, // 登入檢查Api
  // -----------------------------

  // ----------股票資訊----------
  getStockInfo,
  // ---------------------------

  // ----------投資組合----------
  getSummary,
  getHoldings,
  addAssets,
  editAssets,
  deleteAssets,
  sellAssets,
  // ---------------------------

  // ----------個人中心----------
  userInfoData,
  userUpdate,
  userAccountUpgrade,
  // ---------------------------

  // ----------損益概況----------
  dashboardReports,
  dashboardTrendChart,
  // ---------------------------
] as MockMethod[];
