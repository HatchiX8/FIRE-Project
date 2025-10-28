export interface userInfoData {
  name: string;
  nickname: string;
  email: string;
  role: string;
  avatar_url: string | null;
  upgrade_status: string;
}

export interface updateUserInfoPayload {
  nickname: string;
  email: string;
  avatar_url: string | null;
}
