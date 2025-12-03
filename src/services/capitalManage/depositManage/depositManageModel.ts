import type { DefaultPaging } from '@/types/global';
import type { FinancialDetailsSearchFilterParams } from '../financialDetails/financialDetailsModel';

export interface DepositManageSearchFilterParams
  extends Omit<FinancialDetailsSearchFilterParams, 'affiliateId'> {
  status: string;
}

export interface DepositManageSearchParams extends DefaultPaging {
  filter?: DepositManageSearchFilterParams | null;
}

export interface DepositManageType {
  id: string;
  paymentWay: string;
  remarks: string;
  status: string;
}
