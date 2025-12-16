import type { DefaultPaging } from '@/types/global';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';

export interface ReleaseShippingHistorySearchFilterParams {
  id: string;
  carrier: string;
  porCode: string;
  fndCode: string;
  areaId: string;
  etdStart: string;
  etdEnd: string;
  createdStart: string;
  createdEnd: string;
}

export interface ReleaseShippingHistorySearchParams extends DefaultPaging {
  filter?: ReleaseShippingHistorySearchFilterParams | null;
}

export interface ReleaseShippingHistoryMonitoringPortType
  extends Pick<
    ReleaseShippingHistorySearchFilterParams,
    'carrier' | 'porCode' | 'fndCode'
  > {
  id: string | null;
  ctnType: string;
  por: LocationItem;
  fnd: LocationItem;
}
