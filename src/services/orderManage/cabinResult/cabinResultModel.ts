import { DefaultPaging } from '@/types/global';

export interface CabinResultSearchFilterParams {
  carrier: string;
  affiliateId: string;
  status: number;
  porId: string;
  fnd: string;
  createdStart: string;
  createdEnd: string;
}

export interface CabinResultSearchParams extends DefaultPaging {
  filter?: CabinResultSearchFilterParams | null;
}
