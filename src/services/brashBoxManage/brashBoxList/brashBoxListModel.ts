import type { DefaultPaging } from '@/types/global';

export interface BrashBoxListSearchParams extends DefaultPaging {
  createTimeStart?: string;
  createTimeEnd?: string;
  billNo?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface BrashBoxListType {
  id: string | null;
  account: string;
  password: string;
  remark: string;
}
