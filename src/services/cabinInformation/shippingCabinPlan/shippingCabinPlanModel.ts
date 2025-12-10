import type { DefaultPaging } from '@/types/global';

export interface ShippingCabinPlanSearchFilterParams {
  carrier: string;
  porCode: string;
  fndCode: string;
  carrierRoute: string;
}

export interface ShippingCabinPlanSearchParams extends DefaultPaging {
  filter?: ShippingCabinPlanSearchFilterParams | null;
}

export interface ShippingCabinPlanType
  extends Omit<ShippingCabinPlanSearchFilterParams, 'fndCode'> {
  id: string | null;
  planMode: {
    type: 'DAY' | 'WEEK';
    beforeEtd: number;
    week: string;
    weekTime: string;
  };
}
