import type { DefaultPaging } from '@/types/global';

/**
 * 系统角色
 */
export interface SysRoleType {
  roleId: string | null;
  roleName: string;
  comments: string;
  id: string;
  name: string;
}

export interface SysRoleParams
  extends Partial<Omit<SysRoleType, 'id'>>,
    DefaultPaging {}

export interface SysUserParams extends DefaultPaging {
  filter:
    | string
    | Partial<Pick<SysUserType, 'name' | 'username' | 'valid' | 'roleId'>>;
}

export interface SysUserType {
  id: string | number;
  phone: string;
  username: string;
  valid: boolean | number;
  name: string;
  password: string | null;
  roleId: string;
  remarks: string | null;
}
