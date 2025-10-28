import { MockMethod } from 'vite-plugin-mock';
import {
  login,
  loginCheck,
  getSummary,
  getHoldings,
  userInfoData,
  userUpdate,
  userAccountUpgrade,
  dashboardReports,
  dashboardTrendChart,
} from './mockApi/index';

export default [
  // ----------使用者登入----------
  login, // 登入Api
  loginCheck, // 登入檢查Api
  // -----------------------------

  // ----------投資組合----------
  getSummary,
  getHoldings,
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
