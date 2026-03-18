import type { DefaultPaging } from '@/types/global';
import type { FreightPriceListType } from '@/utils/freight/type';

export type RegularBookingSearchFilter = {
  genres: string;
  porCode: string;
  fndCode: string;
  type: string;
  status: string;
  affiliateId: string | null;
  customerId: string | null;
};

export interface RegularBookingSearchParams extends DefaultPaging {
  filter?: Partial<RegularBookingSearchFilter> | null;
}

export interface ShippingScheduleParams extends Pick<
  RegularBookingSearchFilter,
  'fndCode' | 'porCode'
> {
  carrier: string;
}

export interface LocationItem {
  /** 国家代码 */
  countryCode: string;
  /** 国家城市中文 */
  countryLocalName: string;
  /** 国家城市英文 */
  countryName: string;
  /** id */
  id: number;
  /** 港口中文名称 */
  localName: string;
  /** 港口英文名称 */
  name: string;
  /** 港口代码 */
  unlocode: string;
}

export interface SearchRoutePageType extends DefaultPaging {
  filter: {
    customerId: string;
  };
}

export interface RegularBookingDetailType extends RegularBookingDetailOtherType {
  id: string;
  carrier: string;
  type: string;
  // bookedInfo: Record<string, any>;
  payStatus: string;
}

type RegularBookingDetailOtherItemsType = {
  ctnType: string;
  ctnNum: number;
  cargoWeights: number;
  limitedPrice: number;
  totalPriceUsd: number;
  vote: number;
  basPrice: number;
  details: Record<string, any>;
};

type ProductInfoType = {
  surchargeRemark: string;
  penaltyRemark: string;
  remark: string;
  priceList: FreightPriceListType[];
  [key: string]: string | any;
};

type RegularBookingDetailOtherType = {
  items: RegularBookingDetailOtherItemsType[];
  bookingInfo: ProductInfoType;
  carrierInfo: {
    code: string;
    isTraceable: boolean | null;
    name: string;
    shortName: string;
  }[];
  orderCarrierAccounts: {
    affiliate: string;
    code: string;
    name: string;
    password: string;
    payPassword: string;
    shortName: string;
    username: string;
  }[];
  por: LocationItem[];
  fnd: LocationItem[];
  productChannel: string;
  [key: string]: string | any;
};
