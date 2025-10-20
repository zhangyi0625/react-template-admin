import type { DefaultPaging } from '@/types/global';

/**
 * 系统角色
 */
export interface SysRoleType {
  /**
   * 角色ID
   */
  roleId: string | null;

  /**
   * 角色名称
   */
  roleName: string;

  /**
   * 角色备注
   */
  comments: string;
}

export interface SysRoleParams
  extends Partial<Omit<SysRoleType, 'id'>>,
    DefaultPaging {}

export interface SysUserParams
  extends Pick<SysRoleType, 'roleId'>,
    DefaultPaging {
  userName: string | null;
  nickname: string | null;
}

export interface SysUserType
  extends Pick<SysUserParams, 'userName' | 'nickname'> {
  userId: string | null;
  organizationId: string;
  phone: string;
  username: string;
  introduction: string;
  roles: string | string[] | any;
  email: string;
  status?: boolean | number;
  password: string | null;
}
