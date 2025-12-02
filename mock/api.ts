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
  addReports,
  editReports,
  deleteReports,
  investDeposit,
  investWithdrawal,
  userUpgradeList,
  userMemberList,
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

  // ----------資金操作----------
  investDeposit,
  investWithdrawal,
  // ---------------------------

  // ----------個人中心----------
  userInfoData,
  userUpdate,
  userAccountUpgrade,
  // ---------------------------

  // ----------損益概況----------
  dashboardReports,
  dashboardTrendChart,
  addReports,
  editReports,
  deleteReports,
  // ---------------------------

  // ----------管理者頁面----------
  userUpgradeList,
  userMemberList,
  // -----------------------------
] as MockMethod[];
