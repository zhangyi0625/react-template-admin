import { DefaultPaging } from '@/types/global';

export interface AdvertisingManageSearchParams extends DefaultPaging {
  filter?: {
    status: boolean | string;
  } | null;
}

export interface AdvertisingManageType {
  id: string | null;
  title: string;
  content: string;
  status: boolean;
  createTime: string;
  validTo: string;
  validForm: string;
  modifyTime: string;
}
