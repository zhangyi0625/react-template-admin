import type { DefaultPaging } from '@/types/global';

export interface IndustryDynamicsSearchParams extends DefaultPaging {
  groupId?: string;
}

export interface IndustryDynamicsType {
  id: string;
  groupId: string;
  sort: number;
  type: string;
  mainImage: string;
  mainImagePath: string;
  content: string;
  url: string;
  title: string;
}
