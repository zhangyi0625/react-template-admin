import { ComboPermission, LevelSetting } from '@/enums/setting';

export interface EquityRightsBaseEditType {
  affiliateId: string;
  limitType: string;
  module: string;
  queryLimit: number;
}

export interface EquityRightsExtraEditType
  extends Omit<EquityRightsBaseEditType, 'affiliateId'> {
  customerId: string;
}

export interface EquityRightsExtraPriceUpdateType {
  id: string;
  module: keyof typeof ComboPermission;
  l0Price: number;
  l1Price: number;
  l5Price: number;
  l7Price: number;
  l11Price: number;
  l12Price: number;
  l13Price: number;
  l21Price: number;
  [key: string]: string | number;
}
