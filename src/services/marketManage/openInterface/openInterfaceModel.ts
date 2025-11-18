import { DefaultPaging } from '@/types/global';

export interface OpenInterfaceFilterParams {
  customerId: string;
  affiliateId: string;
  key: string;
  name: string;
}

export interface OpenInterfaceParams extends DefaultPaging {
  filter?: OpenInterfaceFilterParams | null;
}

export interface OpenInterfaceType {
  id: string | null;
  customerId: string;
  customerName: string;
  name: string;
  valid: boolean;
  callback: string;
  ipAllows: string;
  remarks: string;
  [key: string]: string | boolean | null;
}

export interface OpenInterfaceBusinessType {
  id: string | null;
  userId: string;
  item: string;
  rateLimit: number;
  validTo: string;
}
