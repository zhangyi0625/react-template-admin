import type { DefaultPaging } from '@/types/global';
import type { AffiliateDetailGradeLogType } from '../affiliateManage/affiliateManageModel';

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

export interface StaffDetailType extends StaffManageType {
  affiliateStated: boolean;
  balance: number;
  bond: number;
  bondLocked: number;
  created: string;
  customersLimit: number;
  wxAid: string;
  wxOid: string;
  wxUid: string;
  gradeLog: AffiliateDetailGradeLogType[];
  [key: string]: any;
}

export type ComboPermissionRecordParams = {
  module: string;
  affiliateId: string | null;
  customerId: string | null;
};

export interface StaffJoinAffiliateType {
  affiliateId: string;
  customerIds: string[];
}
