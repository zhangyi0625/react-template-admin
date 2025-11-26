import type { DefaultPaging } from '@/types/global';

export interface CabinQueryRecordSearchFilterParams {
  createdStart: string;
  createdEnd: string;
  etdStart: string;
  etdEnd: string;
  customerId: string;
  porId: string;
  fndId: string;
}

export interface CabinQueryRecordSearchParams extends DefaultPaging {
  filter?: CabinQueryRecordSearchFilterParams | null;
}
