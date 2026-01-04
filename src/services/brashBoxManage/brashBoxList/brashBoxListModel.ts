import type { DefaultPaging } from '@/types/global';

export interface BrashBoxSearchParams extends DefaultPaging {
  id: string;
  name: string;
}

export interface BrashBoxType {
  id: string | null;
  no: string;
  carrier: string;
  vesselName: string;
  voyNo: string;
  ctnType: string;
  email: string;
  name: string;
  code: string;
  account: string;
}
