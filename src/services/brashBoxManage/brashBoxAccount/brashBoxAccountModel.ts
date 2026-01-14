import type { DefaultPaging } from '@/types/global';

export interface BrashBoxAccountSearchParams extends DefaultPaging {
  filter?: {
    keyword: string;
  } | null;
}

export interface BrashBoxAccountType {
  id: string | null;
  account: string;
  password: string;
  remark: string;
  status: number;
}
