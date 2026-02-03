import type { RouteMangeType } from '@/services/customerInformation/routeManage/routeManageModel';
import type { CarrierManageType } from '@/services/essential/carrierManage/carrierManageModel';
import type { PortManageType } from '@/services/essential/portManage/portManageApi';
import type { DefaultPaging } from '@/types/global';

export interface MemberUnitManageSearchParams extends DefaultPaging {
  name?: string;
  unitLevel?: string;
  memberExpiryDateStart?: string;
  memberExpiryDateEnd?: string;
  sort?: string;
  order?: string;
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
  logo: string | null;
  logoPath: string | null;
  isShow: boolean;
}

export interface MemberUnitManageDetailType extends MemberUnitManageType {
  createTime: string;
  advantageBusiness: string;
  advantagePor: string;
  porList?: PortManageType[];
  advantageFnd: string;
  fndList?: PortManageType[];
  advantageRoute: string;
  routeList?: RouteMangeType[];
  advantageCarrier: string;
  carrierList?: CarrierManageType[];
}

export interface CompanyMemberRecordType {
  id: string | null;
  companyId: string;
  enrollmentDate: string;
  remark: string;
}
