import type { DefaultPaging } from '@/types/global';

export type OrderSearchFilter = {
  genres: string;
  porCode: string;
  fndCode: string;
  type: string;
  status: string;
  affiliateId: string;
};

export interface OrderSearchParams extends DefaultPaging {
  filter: string | Partial<OrderSearchFilter>;
}

export interface ShippingScheduleParams
  extends Pick<OrderSearchFilter, 'fndCode' | 'porCode'> {
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
