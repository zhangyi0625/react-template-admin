import type { DefaultPaging } from '@/types/global';
import { FreightBoxFeeType } from '@/utils/freight/type';

export interface ServiceChargeManageSearchParams extends DefaultPaging {}

export interface ServiceChargeManageEditType {
  id: string | null;
  name: string;
  priority: number;
  services: 'BOOKING' | 'PREBOOKING';
  valid: boolean;
  validFrom: string | null;
  validTo: string | null;
}

export interface ServiceChargeFeeItems
  extends Pick<FreightBoxFeeType, 'standard' | 'bond'> {
  id: string;
  type: 'BK01' | 'BK02' | 'BK03';
  customerLevel: number;
}
