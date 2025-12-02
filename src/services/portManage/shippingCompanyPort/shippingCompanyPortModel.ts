import type { DefaultPaging } from '@/types/global';

export interface ShippingCompanyPortSearchFilterParams {
  locationId: string;
  code: string;
  name: string;
  brand: string;
  unmatchedType: number;
}

export interface ShippingCompanyPortSearchParams extends DefaultPaging {
  filter?: ShippingCompanyPortSearchFilterParams | null;
}

export interface ShippingCompanyPortType
  extends Omit<ShippingCompanyPortSearchFilterParams, 'unmatchedType'> {
  id: string | null;
  unlocode?: string;
  locationName?: string;
}
