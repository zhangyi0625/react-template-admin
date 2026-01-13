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
  startDate: string;
  endDate: string;
  modifyTime: string;
  imageId: string;
}
