export interface InvitationCreateInput {
  groupId: string;
  createdById: string;
  email: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface InvitationCreateRequestBody {
  email: string;
}
