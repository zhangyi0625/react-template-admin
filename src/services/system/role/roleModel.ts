/**
 * 系统角色
 */
export interface SysRoleType {
  /**
   * 角色ID
   */
  id: string | null

  /**
   * 角色名称
   */
  roleName: string

  /**
   * 角色备注
   */
  comments: string
}

export interface SysRoleParams extends Partial<Omit<SysRoleType, 'id'>> {
  page: number
  size: number
}

export interface SysUserParams {
  page: number
  size: number
  roleId: string
  loginName?: string
  nickname?: string
}

export interface SysUserType
  extends Pick<SysUserParams, 'loginName' | 'nickname'> {
  id: string | null
  orgId: string
  phone: string
  introduction: string
  loginPwd: string
  roles: string | string[] | any
  email: string
}
