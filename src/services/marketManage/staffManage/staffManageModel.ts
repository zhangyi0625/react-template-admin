import type { DefaultPaging } from '@/types/global';

export interface StaffManageType {
  id: string | null;
  affiliateId: string;
  affiliateName: string;
  name: string;
  email: string;
  level: string | number;
  phone: string;
  permissions: string;
  valid: boolean;
  validTo: string;
}

export interface StaffManageParams extends DefaultPaging {
  filter: Partial<Pick<StaffManageType, 'affiliateId' | 'name' | 'phone'>>;
  projection?: 'AFFILIATE_CUSTOMER' | 'SMALL';
  sort?: {
    id: string | number;
  };
}

export interface StaffJoinAffiliateType {
  affiliateId: string;
  customerIds: string[];
}
