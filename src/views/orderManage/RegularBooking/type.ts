import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export interface MergeCustomColumn extends CustomColumn {
  publicSettingKey?: string;
}

export type RegularBookingDetailBaseInfoType = {
  label: string;
  key: string;
  type: 'ALL' | 'BOOKING' | 'PREBOOKING';
  bySetting?: string;
  getValue?: ((value: any) => void) | null;
  value?: string;
};

export type RegularBookingDetailTimeLine = {
  title: string;
  content: string;
  created: string;
  operator: string;
};

export type RegularBookingStatusType = {
  status: string;
  cancelStatus: string | null;
  refundStatus: string | null;
  payStatus: string | null;
};

export type RegularBookingStatusConditionType = {
  valueText: string;
  titleIcon: string;
  conditionFun: (status: Partial<RegularBookingStatusType>) => boolean;
  showBtn: boolean;
  cancelBtnText?: string;
  confirmBtnText?: string;
  confirmHint?: string;
  confirmApi?: any;
};

export type RegularBookingFailReasonType = {
  label: string;
  reason: string[];
};

export interface CargoReuirementOptionsType {
  label: string;
  includeCarrier: string;
  key: string;
  value?: string | null;
  replaceFn?: (type: string | any) => string;
  other?: string | null;
}

export type RegularBookingStatusOptionsType<T = Record<string, any>> = {
  payStatus: T;
  cancelStatus: T;
  refundStatus: T;
  baseStatus: T;
};
