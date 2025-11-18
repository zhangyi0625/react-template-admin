import type { DefaultPaging } from '@/types/global';

export interface LevelManageFilterarams {
  customerId: string;
  affiliateId: string;
  gradeLevel: string;
  createdStart: string;
  createdEnd: string;
}

export interface LevelManageParams extends DefaultPaging {
  filter?: LevelManageFilterarams | null;
}
