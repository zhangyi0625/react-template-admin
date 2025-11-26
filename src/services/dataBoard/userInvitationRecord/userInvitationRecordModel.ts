import type { DefaultPaging } from '@/types/global';

export interface UserInvitationRecordSearchFilterParams {
  inviterId: string;
  inviteeId: string;
  createdStart: string;
  createdEnd: string;
}

export interface UserInvitationRecordSearchParams extends DefaultPaging {
  filter?: UserInvitationRecordSearchFilterParams | null;
}
