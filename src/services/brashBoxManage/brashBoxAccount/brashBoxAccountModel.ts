import type { DefaultPaging } from '@/types/global';

export interface BrashBoxAccountSearchParams extends DefaultPaging {
  filter?: {
    keyword: string;
  } | null;
  sort?: string;
  order?: string;
}

export interface BrashBoxAccountType {
  id: string | null;
  account: string;
  password: string;
  remark: string;
  status: number;
}
