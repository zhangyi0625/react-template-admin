import type { DefaultPaging } from '@/types/global';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';
import type { CostDetailType, DndPriceType } from '@/utils/freight/type';

export interface CabinManageSearchFilterStatus {
  id: string | number;
}

export interface CabinManageSearchFilterParams {
  affiliateId: string;
  carrier: string;
  status: 'SELLING';
  porId: string;
  fndId: string;
  route: string;
  validFrom: string;
  vesselName: string;
  voyNo: string;
  etd: string;
  validTo: string;
  channel: string;
}

export interface CabinManageSearchParams extends DefaultPaging {
  filter?: CabinManageSearchFilterParams | null;
  sort: CabinManageSearchFilterStatus | null;
}

export interface CabinManageType extends CabinManageSearchFilterParams {
  id: string;
  affiliateName: string;
  created: string;
  updated: string;
  carrierCode: string;
  productType: string;
  voyDays: number;
  transitNum: number;
  por: LocationItem;
  fnd: LocationItem;
  eta: string;
  transClause: 'CY-CY' | 'CY-SD';
  deadlines: {
    SI: string;
  };
  createTime: string;
  modifytime: string;
  surchargeRemark: string;
  priceDetails: {
    basePrice: number;
    costDetail: CostDetailType[];
    ctnType: string;
    currency: string;
    dndDetail: DndPriceType[];
    inventory: string | number;
    totalPrice: number;
  }[];
  prices: {
    notes: {
      penalty: string;
    };
  };
  remark: string;
  references: unknown[];
}
