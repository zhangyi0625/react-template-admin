import type { DefaultPaging } from '@/types/global';

export interface SysStaffParams extends DefaultPaging {
  filter:
    | string
    | Partial<Pick<SysStaffType, 'name' | 'username' | 'valid' | 'roleId'>>;
}

export interface SysStaffType {
  id: string | number;
  phone: string;
  username: string;
  valid: boolean | number;
  name: string;
  password: string | null;
  roleId: string;
  remarks: string | null;
}

export interface SysStaffResetPasswordType {
  phone: string;
  password: string;
  verifyCode: string;
  verifyKey: string;
}
