import type { DefaultPaging } from '@/types/global';

export interface BoxPileManageSearchParams extends DefaultPaging {
  order?: string;
  sort?: string;
  enabled?: number;
}

export interface BoxPileManageType extends BoxPileManageSearchParams {
  id: string | null;
  code: string;
  name: string;
}
