import type { DefaultPaging } from '@/types/global';
import type { FinancialDetailsSearchFilterParams } from '../financialDetails/financialDetailsModel';

export interface ClientsCapitalSearchFilterParams
  extends Omit<FinancialDetailsSearchFilterParams, 'affiliateId'> {
  tradeNo: string;
}

export interface ClientsCapitalSearchParams extends DefaultPaging {
  filter?: ClientsCapitalSearchFilterParams | null;
}

export interface ClientsCapitalType extends ClientsCapitalSearchFilterParams {
  id: string;
}
