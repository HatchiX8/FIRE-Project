import { MockMethod } from 'vite-plugin-mock';
import { login, loginCheck, getSummary } from './mockApi/index';

export default [
  // ----------使用者登入----------
  login, // 登入Api
  loginCheck, // 登入檢查Api
  // -----------------------------

  // ----------投資組合----------
  getSummary,
  // ---------------------------
] as MockMethod[];
