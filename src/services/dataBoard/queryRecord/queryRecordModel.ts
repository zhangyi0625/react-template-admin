import type { DefaultPaging } from '@/types/global';

export interface QueryRecordSearchFilterParams {
  customerId?: string;
  affiliateId?: string;
  createdStart?: string;
  createdEnd?: string;
  module: string;
}

export interface QueryRecordSearchParams extends DefaultPaging {
  filter?: QueryRecordSearchFilterParams | null;
}
