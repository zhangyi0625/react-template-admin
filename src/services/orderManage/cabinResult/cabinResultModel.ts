import { DefaultPaging } from '@/types/global';

export interface CabinResultSearchFilterParams {
  carrier: string;
  affiliateId: string;
  status: number;
  porId: string;
  fnd: string;
  createdStart: string;
  createdEnd: string;
}

export interface CabinResultSearchParams extends DefaultPaging {
  filter?: CabinResultSearchFilterParams | null;
}

export interface ManualpublicationType {
  etaEtdDay: string;
  carrier: string;
  porId: string;
  fndId: string;
  vesselName: string;
  voyageNo: string;
  haulage: 'CY-CY';
  // transitDays: "",
  etd: string;
  eta: string;
  transshipment: string;
  validFrom: string;
  validTo: string;
  deadlines: {
    SI: string;
  };
  remarks: string;
  inventories: [
    {
      containerType: string;
      discountPrice: string;
      inventory: '0';
      price: string;
      priceCurrency: string;
    }
  ];
}

export interface ImportCabinResultType {
  affiliateId: string;
  carrier: string;
  file: File;
}
