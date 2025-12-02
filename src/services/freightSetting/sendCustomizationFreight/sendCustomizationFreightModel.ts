import type { DefaultPaging } from '@/types/global';

export interface SendCustomizationFreightSearchFilterParams {
  affiliateId: string;
  customerId: string;
  createdStart: string;
  createdEnd: string;
}

export interface SendCustomizationFreightSearchParams extends DefaultPaging {
  filter?: SendCustomizationFreightSearchFilterParams | null;
}

export interface SendCustomizationFreightType {
  id: string | null;
  customerId: string;
  customerName: string;
  email: string;
  execTime: string;
  freights: {
    porCode: string | undefined;
    fndCode: string | undefined;
    carrier: string | undefined;
  }[];
}
