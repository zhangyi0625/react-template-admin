import type { DefaultPaging } from '@/types/global';

export interface MemberUnitAboutSearchParams extends DefaultPaging {
  columnName?: string;
  sort?: string;
  order?: string;
}

export interface MemberUnitAboutType {
  id: string;
  columnName: string;
  groupName: string;
  sort: number;
  type: string;
  imageIds: string;
  imagePath: string[];
  content: string;
  name: string;
}
