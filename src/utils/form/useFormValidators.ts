import type { FormItemRule } from 'naive-ui';
// 不可小於 0 驗證器
export const nonNegative =
  (label = '數值'): FormItemRule['validator'] =>
  (_rule, v: number) =>
    v > 0 ? true : new Error(`${label}不可小於等於 0`);

// 需為整數驗證（股數用）
export const integerOnly: FormItemRule['validator'] = (_r, v: number) =>
  Number.isInteger(v) ? true : new Error('須為整數');

// 共用：判斷是否為閏年
export const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

// YYYY-MM-DD 日期格式驗證器
export const ymdValidator: FormItemRule['validator'] = (_r, v: string) => {
  if (typeof v !== 'string') return new Error('日期需為字串');
  const normalized = v.replace(/\//g, '-');
  const m = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return new Error('格式需為 YYYY-MM-DD 或 YYYY/MM/DD');

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  if (month < 1 || month > 12) return new Error('月份需為 01–12');

  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDay = daysInMonth[month - 1];
  if (day < 1 || day > maxDay) return new Error(`該月天數為 ${maxDay} 天`);

  return true;
};

export const today = (() => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
})();
