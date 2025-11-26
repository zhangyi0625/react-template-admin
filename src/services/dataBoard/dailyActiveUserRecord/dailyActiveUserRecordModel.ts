import type { DefaultPaging } from '@/types/global';

export interface DailyActiveUserRecordSearchFilterParams {
  customerId: string;
  dateStart: string;
  dateEnd: string;
}

export interface DailyActiveUserRecordSearchParams extends DefaultPaging {
  filter?: DailyActiveUserRecordSearchFilterParams | null;
}
