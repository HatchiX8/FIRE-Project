export interface apiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface userInfo {
  token: string;
  user: {
    id: string;
    name: string;
    nickname: string;
    email: string;
    avatar_url: string;
    role: string;
    upgrade_status: string;
    is_active: boolean;
  };
}
