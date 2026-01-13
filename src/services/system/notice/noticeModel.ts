import { DefaultPaging } from '@/types/global';

export interface NoticeManageSearchParams extends DefaultPaging {
  filter?: {
    status: boolean | string;
  } | null;
}

export interface NoticeManageType {
  id: string | null;
  title: string;
  content: string;
  status: boolean;
  createTime: string;
  startDate: string;
  endDate: string;
  modifyTime: string;
}
