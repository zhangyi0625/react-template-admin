import type { DefaultPaging } from '@/types/global';

export interface RouteManageSearchFilterParams {
  carrier: string;
  channel: string;
  porId: string;
  fndId: string;
  route: string;
  updatedStart: string;
  updatedEnd: string;
}

export interface RouteManageSearchParams extends DefaultPaging {
  filter?: RouteManageSearchFilterParams | null;
  sort: {
    id: string | number;
  };
}

export interface RouteManageByCarrierRouteType {
  carriers: string[];
  porIds: string[];
  fndIds: string[];
  options: {
    haulageModes: string[];
  };
}
