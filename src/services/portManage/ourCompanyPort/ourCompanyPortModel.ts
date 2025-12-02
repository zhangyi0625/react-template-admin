import { DefaultPaging } from '@/types/global';

export interface OurCompanyPortSearchFilterParams {
  code: string;
  name: string;
  countryCode?: string;
}

export interface OurCompanyPortSearchParams extends DefaultPaging {
  filter?: OurCompanyPortSearchFilterParams | null;
}

export interface OurCompanyPortType extends OurCompanyPortSearchFilterParams {
  id: string | null;
  parentAreaId: number;
  areaId: string;
  countryId: string;
  popularity: number;
  tags: string;
}
