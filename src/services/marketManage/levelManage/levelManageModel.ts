import type { DefaultPaging } from '@/types/global';

export interface LevelManageFilterParams {
  customerId: string;
  affiliateId: string;
  gradeLevel: string;
  createdStart: string;
  createdEnd: string;
}

export interface LevelManageParams extends DefaultPaging {
  filter?: LevelManageFilterParams | null;
}
