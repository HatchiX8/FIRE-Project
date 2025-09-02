import { MockMethod } from 'vite-plugin-mock';
import { login, loginCheck } from './mockApi/index';

export default [
  login, // 登入Api
  loginCheck, // 登入檢查Api
] as MockMethod[];
