import type { DefaultPaging } from '@/types/global';

export interface BrashBoxSearchParams extends DefaultPaging {
  filter?: {
    keyword: string;
  } | null;
}

export interface BrashBoxType {
  id: string | null;
  account: string;
  password: string;
  remark: string;
}
