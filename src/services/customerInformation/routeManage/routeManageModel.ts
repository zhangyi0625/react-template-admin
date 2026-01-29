import type { DefaultPaging } from '@/types/global';

export interface RouteMangeType {
  id?: string | null;
  name: string;
  parentId: string | null;
  remark: string;
  updateTime: string;
}

export interface RouteMangeParams
  extends Partial<RouteMangeType>, DefaultPaging {}
