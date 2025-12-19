import type { DefaultPaging } from '@/types/global';

export interface NoticeManageSearchParams extends DefaultPaging {
  filter: {
    type: 'MOBILE_HOME_TOP';
  };
}

export interface NoticeManageEditType {
  id: string | null;
  content: string;
  sequence: number;
  title: string;
  type: 'MOBILE_HOME_TOP';
  validFrom: string;
  validTo: string;
}
