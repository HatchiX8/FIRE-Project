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

export interface UserUpgradeReviewPayload {
  status: ReviewAction;
  adminNote?: string;
}

export interface UserActivationPayload {
  status: MemberAction;
  adminNote?: string;
}

export type ReviewAction = 'approved' | 'rejected';
export type MemberAction = 'downgrade' | 'ban';
