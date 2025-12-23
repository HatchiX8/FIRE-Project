export interface ApiBody<T> {
  message?: string;
  data?: T;
}

export type ApiResult<T> =
  | { ok: true; status: number; data: T; message?: string }
  | { ok: false; status: number; message: string };
