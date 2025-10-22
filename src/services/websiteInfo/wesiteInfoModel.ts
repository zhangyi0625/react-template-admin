import { DefaultPaging } from '@/types/global';

export interface UserFeedbackParams extends DefaultPaging {}

export interface ShippingCompanyZoneType {
  id: null | string;
  code: string;
  name: string;
  shortName: string;
}

export interface ShippingCompanyZoneParams extends DefaultPaging {
  filter: string | Partial<Pick<ShippingCompanyZoneType, 'code' | 'name'>>;
}
