import type { DefaultPaging } from '@/types/global';

export interface FreightTaskConfigurationSearchFilterParams {
  carrierCode?: string;
  source?: string | 'Y_DATA' | 'CARRIER_ENGINE';
  isEnabled: number;
}

export interface FreightTaskConfigurationSearchParams extends DefaultPaging {
  filter?: FreightTaskConfigurationSearchFilterParams | null;
}

export interface FreightTaskConfigurationType
  extends FreightTaskConfigurationSearchFilterParams {
  id: string | null;
  porCode: string;
  fndCode: string;
  username: string;
  password: string;
  etdOffsetDay: string;
}
