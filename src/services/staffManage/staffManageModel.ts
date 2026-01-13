import { DefaultPaging } from '@/types/global';

export interface StaffManageSearchParams extends DefaultPaging {
  filter?: {
    status: boolean | string;
  } | null;
}

export interface StaffManageType {
  id: string | null;
  name: string;
  companyName: string;
  phone: string;
  status: boolean;
  createTime: string;
  modifyTime: string;
}
