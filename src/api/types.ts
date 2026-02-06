export interface ApiBody<T> {
  message?: string;
  data?: T;
}

export type TransportResult<T> =
  | { ok: true; status: number; data: T; message?: string }
  | { ok: false; status: number; message: string };

export type ApiResult<T> =
  | { success: true; data: T; message: string }
  | { success: false; message: string };
