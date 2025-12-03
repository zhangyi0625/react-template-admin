import type { DefaultPaging } from '@/types/global';

export interface FinancialDetailsSearchFilterParams {
  customerId: string;
  affiliateId: string;
  fund: string;
  createdStart: string;
  createdEnd: string;
}

export interface FinancialDetailsSearchParams extends DefaultPaging {
  filter?: FinancialDetailsSearchFilterParams | null;
}

export interface FinancialDetailsType
  extends Omit<
    FinancialDetailsSearchFilterParams,
    'createdStart' | 'createdEnd'
  > {
  id: string | null;
  paymentNo: string;
  created: string;
  paymentPayer: string;
  amount: string;
  paymentPayee: string;
  accomplished: string;
  paymentWay: string;
  fundType: string;
}
