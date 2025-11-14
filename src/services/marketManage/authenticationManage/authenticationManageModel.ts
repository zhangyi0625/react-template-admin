import type { DefaultPaging } from '@/types/global';

export interface AuthenticationManageParams extends DefaultPaging {
  filter: {
    status: string | null | number;
  };
}

export interface AuthenticationAuditRejectType {
  ids: string[];
  status: 'REJECTED';
  rejectReason: string;
}

export interface AuthenticationAuditUrlType {
  name: string;
  type: 'BC01' | 'BC02';
  url: string;
}
