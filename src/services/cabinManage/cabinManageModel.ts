import type { DefaultPaging } from '@/types/global';

type CabinExtraInfo = {
  contractNo: string;
  extentDndFreeDays: number;
  withRollable: boolean;
};

type PortCodeInfo = Pick<CabinTaskTemplateType, 'porCode' | 'fndCode'>;

export interface CabinTaskTemplateType {
  id?: string | null | number;
  porCode: string;
  fndCode: string;
  etd: string;
  ctnQty: number;
  ctnTicket: number;
  priceLimit: string | number;
  extra: Partial<CabinExtraInfo>;
  customerId: number;
  carrier: string;
}

export interface CabinTaskTemplateParams
  extends Partial<PortCodeInfo>,
    DefaultPaging {
  routeFndId: null | string;
  etdStart?: string;
  etdEnd?: string;
  createdStart?: string;
  createdEnd?: string;
  customer?: string;
  status: string;
  carrier?: string;
  sort: string;
}

export interface CabinHistoryParams
  extends Partial<PortCodeInfo>,
    DefaultPaging {
  router: string | number | null;
  cabinStart?: string;
  cabinEnd?: string;
}

export interface CabinResultParams
  extends Partial<PortCodeInfo>,
    DefaultPaging {
  carrier?: string | null;
  customerId?: string | number | null;
  cabinStart?: string;
  cabinEnd?: string;
}

export interface TodayPlanParams extends Partial<PortCodeInfo>, DefaultPaging {
  carrier?: string | null;
  routeFndId?: null | string;
}
