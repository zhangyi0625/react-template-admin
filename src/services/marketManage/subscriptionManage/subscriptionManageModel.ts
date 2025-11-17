import { DefaultPaging } from '@/types/global';

export interface SubscriptionManageFilterParams {
  customerId: string;
  affiliateId: string;
  carrier: string;
  disable: number | boolean;
  porId: string;
  fndId: string;
}

export interface SubscriptionManageParams extends DefaultPaging {
  filter?: SubscriptionManageFilterParams | null;
}
