// utils/notify.ts
export type NotifyLevel = 'error' | 'success' | 'warning' | 'info';
export type Notifier = (level: NotifyLevel, message: string) => void;

let notifier: Notifier | null = null;

export const setNotifier = (fn: Notifier) => {
  notifier = fn;
};

export const notify = (level: NotifyLevel, msg: string) => {
  const message = msg?.trim() ? msg : '未知錯誤';
  if (notifier) {
    notifier(level, message);
    return;
  }
  // fallback：至少不要爆掉（可選）
  // console[level === 'error' ? 'error' : 'log'](message);
};
