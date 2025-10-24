import type { DefaultPaging } from '@/types/global';

export interface PacketManageType {
  id: string | null;
  activityName: string;
  activityPic: string;
  startDate: string;
  endDate: string;
  configJson: string;
  awardJson: string;
  type: 'SUBSCRIBE';
  desc: string;
}

export interface PacketManageParams extends DefaultPaging {}
