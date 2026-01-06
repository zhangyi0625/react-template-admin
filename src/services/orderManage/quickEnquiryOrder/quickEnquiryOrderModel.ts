import type { DefaultPaging } from '@/types/global';
import type { LocationItem } from '../regularBooking/regularBookingModel';

export interface QuickEnquiryOrderSearchFilterParams {
  no: string;
  porCode: string;
  fndCode: string;
  customerId: string;
  affiliateId: string;
  status: string;
}

export interface QuickEnquiryOrderSearchParams extends DefaultPaging {
  filter?: QuickEnquiryOrderSearchFilterParams | null;
}

export interface QuickEnquiryOrderDetailType
  extends QuickEnquiryOrderSearchFilterParams {
  por: LocationItem;
  fnd: LocationItem;
  containers: Record<string, number>;
  commodity: string;
  cargoWeight: number;
  cargoVolume: number;
  transportType: 'SEABORNE';
  highlightsDesc: string;
  delivery: string;
  etd: string;
  validTo: string;
  carriers: string;
  created: string;
  desiredTotalPrice: number;
  remark: string;
  affiliateName: string;
  customerName: string;
  contact: {
    name: string;
    phone: string;
    telephone: string;
    qq: string;
    wx: string;
    email: string;
  };
}

export interface QuickEnquiryOrderEventItemType {
  created: string;
  content: string;
  title: string;
  no: string;
}
