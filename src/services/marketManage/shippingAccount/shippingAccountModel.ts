import type { DefaultPaging } from '@/types/global';

export interface ShippingAccountManageFilterParams {
  customerId: string;
  affiliateId: string;
  carrier: string;
  type: string | 'WEB' | 'API';
  username: string;
  affiliate: string;
  status: number;
}

export interface ShippingAccountManageParams extends DefaultPaging {
  filter?: ShippingAccountManageFilterParams | null;
}

export interface ShippingAccountAuditType {
  id: string;
  force: boolean;
  pass: boolean;
  invalidMsg: string;
}
