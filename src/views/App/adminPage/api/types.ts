export interface StockRow {
  id: string;
  name: string;
  upgradeReason: string;
  createdAt: string;
}

export interface UserUpgradeRequest {
  id: string;
  name: string;
  upgradeReason: string;
  createdAt: string;
}

export interface UserMemberRequest {
  id: string;
  name: string;
  memberAge: number;
  adminNote: string;
}
