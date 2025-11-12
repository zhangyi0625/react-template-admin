import type { DefaultPaging } from '@/types/global';

export interface StaffManageType {
  affiliateId: string;
  name: string;
  phone: string;
}

export interface StaffManageParams extends DefaultPaging {
  filter: Partial<Pick<StaffManageType, 'affiliateId' | 'name' | 'phone'>>;
  // {
  //   affiliateId: string;
  // };
  projection: 'AFFILIATE_CUSTOMER' | 'SMALL';
}

export interface StaffJoinAffiliateType {
  affiliateId: string;
  customerIds: string[];
}
