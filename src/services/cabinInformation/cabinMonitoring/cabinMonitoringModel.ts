import type { DefaultPaging } from '@/types/global';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';

export interface CabinMonitoringSearchFilterParams {
  taskId: string;
  affiliateId: string;
  customerId: string;
  status: string;
}

export interface CabinMonitoringSearchParams extends DefaultPaging {
  filter?: CabinMonitoringSearchFilterParams | null;
}

export interface CabinMonitoringDetailType
  extends CabinMonitoringSearchFilterParams {
  taskName: string;
  carrier: string;
  carrierType: string;
  ctnType: string[];
  portConfig: {
    por: LocationItem;
    porCode: string;
    fndCode: string;
    fnd: LocationItem;
  }[];
  accounts: { username: string }[];
  etdRange: {
    startDate: string;
    endDate: string;
  }[];
  extra: CabinMonitoringExtraType;
  restrict: Record<string, CabinMonitoringRestrictType> | string;
  email: string[];
}

export interface CabinMonitoringRestrictType {
  workday: CabinMonitoringRestrictDayItemsType[];
  nonworkdays: CabinMonitoringRestrictDayItemsType[];
}

export interface CabinMonitoringRestrictDayItemsType {
  startTime: string;
  endTime: string;
  min: number;
  max: number;
}

export interface CabinMonitoringExtraParams {
  key: string;
  value: string;
}

export interface CabinMonitoringExtraType {
  commodityName: string;
  vesselStatus: string[];
  customerCode: string;
  emergencyContact: {
    countryCode: string;
    name: string;
    number: string;
  };
}
