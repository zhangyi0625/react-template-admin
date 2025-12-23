import type { DefaultPaging } from '@/types/global';

export interface CouponManageSearchParams extends DefaultPaging {}

export interface CouponManageEditType {
  id: string | null;
  applyRange: string;
  customerLevel: number;
  discount: {
    amount?: number | undefined;
    threshold?: number | undefined;
    type: 'AMOUNT' | 'CTN';
  };
  distributeNum: number | null;
  distribute: {
    type: 'CUSTOMER_LIST' | 'LINK' | 'TRIGGER_EVENT';
    totalNum?: number;
    perNum?: number;
    taskEvent?: string;
    taskValidFrom?: string;
    taskValidTo?: string;
  };
  name: string;
  orderTypes: 'BOOKING' | 'PREBOOKING';
  productChannels: 'CARRIER' | 'BROKER';
  porIds: string;
  routes: string;
  validRule: {
    validFrom?: string;
    validTo?: string;
    validRuleDay?: number;
    type: 'RELATIVE' | 'ABSOLUTE';
  };
  customerId: string;
  created: string;
}

export interface CouponProvideType {
  count: number;
  affiliateIds: string[];
  customerIds: string[];
}
