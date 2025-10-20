import type { DefaultPaging } from '@/types/global';

export interface CustomerManageType {
  id?: string | null;
  name: string;
  shortName: string;
  socialCode: string;
}

export interface CustomerManageParams extends DefaultPaging {
  name: string | null;
  sort: string;
}
