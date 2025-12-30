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

export interface ShipownerEncyclopediaType {
  id: string;
  officialName: string;
  localName: string;
  websites: { type: string; url: string }[];
  description: string;
  offices: ShipownerEncyclopediaOffices[];
}

export interface ShipownerEncyclopediaOffices {
  address: string;
  email: string;
  fax: string;
  name: string;
  scope: string;
  tel: string;
  [key: string]: string;
}
