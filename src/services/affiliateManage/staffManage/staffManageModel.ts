import type { DefaultPaging } from '@/types/global';

export interface StaffManageSearchParams extends DefaultPaging {
  companyId?: string;
  phone?: string;
}

export interface StaffManageType {
  id: string | null;
  phone: string;
  name: string;
  position: string;
  companyName: string;
  email: string;
}
