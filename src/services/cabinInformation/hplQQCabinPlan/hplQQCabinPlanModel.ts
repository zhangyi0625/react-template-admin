import type { DefaultPaging } from '@/types/global';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';

export interface HplQQCabinPlanSearchFilterParams {
  customerId: string;
  affiliateId: string;
  porCode: string;
  fndCode: string;
  status: string;
}

export interface HplQQCabinPlanSearchParams extends DefaultPaging {
  filter?: HplQQCabinPlanSearchFilterParams | null;
}

export interface HplQQCabinPlanSearchResultType {
  id: string;
  por: LocationItem;
  fnd: LocationItem;
  carrierRoute: string;
  booking: HplQQCabinPlanBookingResultBooking;
  executeCron: string;
  taskMode: {
    endDate: string | null;
    etd: string;
    startDate: string | null;
    type: 'ETD' | 'DATE';
    vesselIds: string | null;
    vesselName: string;
    voyNo: string;
  };
}

export interface HplQQCabinPlanBookingResultBooking {
  accountId: string;
  ctnType: string;
  ctnNum: number;
  status: string;
  ctnWeight: string;
  ctnOwner: string;
  customerRefNo: string;
  email: string;
  contract: string;
  contractNo: string;
  routingPartyOne: string;
  routingPartyTwo: string;
}

export interface HplQQCabinPlanShippingScheduleSearchParams
  extends DefaultPaging {
  filter?: {
    porCode: string;
    fndCode: string;
    query_etd: string;
  };
}
