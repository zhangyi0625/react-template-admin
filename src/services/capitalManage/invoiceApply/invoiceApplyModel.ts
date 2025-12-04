import type { DefaultPaging } from '@/types/global';

export interface InvoiceApplySearchFilterParams {
  customerId: string;
  affiliateId: string;
  status: number | boolean;
}

export interface InvoiceApplySearchParams extends DefaultPaging {
  filter?: InvoiceApplySearchFilterParams | null;
}

export interface InvoiceApplyType extends InvoiceApplySearchFilterParams {
  id: string;
  affiliateName: string;
  customerName: string;
  created: string;
  amount: number;
  customerPhone: string;
  email: string;
  invoiceTitle: string;
  [key: string]: string | number | boolean;
}

export interface InvoiceApplyOrderImportType {
  customerName: string;
  customerPhone: string;
  orderNo: string;
  amount: number;
  created: string;
  payType: string;
  type: string;
}
