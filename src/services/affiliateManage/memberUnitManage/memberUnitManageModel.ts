import { DefaultPaging } from '@/types/global';

export interface MemberUnitManageSearchParams extends DefaultPaging {
  name?: string;
  unitLevel?: string;
  memberExpiryDateStart?: string;
  memberExpiryDateEnd?: string;
}

export interface MemberUnitManageType {
  id: string | null;
  name: string;
  memberExpiryDate: string;
  unitLevel: number;
  socialCode: string;
  establishmentDate: string;
  contactPhone: string;
  address: string;
  enterpriseDescription: string;
  memberLevel: number;
  logo: string;
  isShow: boolean;
}

export interface MemberUnitManageDetailType extends MemberUnitManageType {
  createTime: string;
}

export interface CompanyMemberRecordType {
  id: string | null;
  companyId: string;
  enrollmentDate: string;
  remark: string;
}
