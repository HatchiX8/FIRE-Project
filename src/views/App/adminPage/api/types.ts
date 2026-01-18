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
  userNote: string;
}

export interface UserUpgradeReviewPayload {
  status: ReviewAction;
  userNote?: string;
}

export interface UserActivationPayload {
  status: MemberAction;
  userNote?: string;
}

export type ReviewAction = 'approved' | 'rejected';
export type MemberAction = 'downgrade' | 'ban';
