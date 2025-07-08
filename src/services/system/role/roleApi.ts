import { HttpRequest } from '@/utils/request'
import type {
  SysRoleParams,
  SysRoleType,
  SysUserParams,
  SysUserType,
} from './roleModel'

/**
 * 枚举角色相关的api
 */
export enum RoleApi {
  /**
   * 获取角色列表
   */
  getRoleList = '/api/system/role/page',
  /**
   * 获取角色详情
   */
  getRoleDetail = '/system/role/detail',
  /**
   * 新增角色
   */
  addRole = '/api/system/role/add',
  /**
   * 编辑角色
   */
  editRole = '/api/system/role/update',

  /**
   * 改变角色状态
   */
  changeStatus = '/system/role/changeStatus',

  /**
   * 删除角色
   */
  deleteRole = '/api/system/role/delete/',

  /**
   * 获取角色菜单
   */
  getRoleMenu = '/system/role/getRoleMenu',

  /**
   * 获取角色用户
   */
  getRoleUser = '/api/system/user/page',

  /**
   * 新增角色用户
   */
  addRoleUser = '/api/system/user/add',

  /**
   * 修改角色用户状态
   */
  updateRoleUserStatus = '/api/system/user/update',

  /**
   * 删除角色用户
   */
  deleteRoleUser = '/api/system/user/delete/',

  /**
   * 批量删除角色用户
   */
  batchDeleteRoleUser = '/api/system/user/batchDelete',

  /**
   * 获取不在该角色下的所有可用用户
   */
  getUserNotInRoleByPage = '/system/role/getUserNotInRoleByPage',

  /**
   * 给角色分配菜单
   */
  assignRoleMenu = '/system/role/assignRoleMenu',

  /**
   * 给角色分配用户
   */
  assignRoleUser = '/system/role/assignRoleUser',

  /**
   * 校验角色编码是否重复
   */
  checkRoleCodeExist = '/system/role/checkRoleCodeExist',
}

/**
 * 查询角色列表
 * @param params 角色参数
 * @returns 角色列表
 */
export const getRoleList = (params: SysRoleParams) => {
  return HttpRequest.get<SysRoleType[]>(
    {
      url: RoleApi.getRoleList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 新增角色
 * @param params 角色参数
 * @returns 结果
 */
export const addRole = (params: SysRoleType) => {
  return HttpRequest.post({
    url: RoleApi.addRole,
    data: params,
  })
}

/**
 * 编辑角色信息
 * @param params 角色参数
 * @returns 结果
 */
export const editRole = (params: SysRoleType) => {
  return HttpRequest.post({
    url: RoleApi.editRole,
    data: params,
  })
}

/**
 * 更新角色状态
 * @param params 角色参数
 * @returns 结果
 */
export const changStatus = (params: { id: string; status: number }) => {
  return HttpRequest.post({
    url: RoleApi.updateRoleUserStatus,
    data: params,
  })
}

/**
 * 删除角色
 * @param params 角色参数
 * @returns 结果
 */
export const deleteRole = (id: string) => {
  return HttpRequest.delete({
    url: RoleApi.deleteRole + id,
  })
}

/**
 * 获取角色菜单权限
 * @param params 角色参数
 * @returns 结果
 */
export const getRoleMenu = (roleId: string) => {
  return HttpRequest.get(
    {
      url: RoleApi.getRoleMenu,
      params: { roleId },
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分配角色菜单权限
 * @param params 角色参数
 * @returns 结果
 */
export const assignRoleMenu = (params: any) => {
  return HttpRequest.post({
    url: RoleApi.assignRoleMenu,
    data: params,
  })
}

/**
 * 分配角色用户
 * @param params 角色参数
 * @returns 结果
 */
export const assignRoleUser = (params: any) => {
  return HttpRequest.post({
    url: RoleApi.assignRoleUser,
    data: params,
  })
}

/**
 * 获取角色用户
 * @param params 角色参数
 * @returns 结果
 */
export const getRoleUser = (params: SysUserParams) => {
  return HttpRequest.get(
    {
      url: RoleApi.getRoleUser,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 新增角色用户
 * @param params 用户参数
 * @returns 结果
 */
export const postRoleUser = (params: SysUserType) => {
  return HttpRequest.post(
    {
      url: RoleApi.addRoleUser,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除角色用户
 * @param params 用户参数
 * @returns 结果
 */
export const deleteRoleUser = (id: string) => {
  return HttpRequest.delete({
    url: RoleApi.deleteRoleUser + id,
  })
}

/**
 * 批量删除角色用户
 * @param params 用户参数
 * @returns 结果
 */
export const postBatchRoleUser = (params: { ids: string[] }) => {
  return HttpRequest.post(
    {
      url: RoleApi.addRoleUser,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取不在该角色下的所有可用用户
 * @param params 角色参数和分页参数
 * @returns 结果
 */
export const getUserNotInRoleByPage = (params: any) => {
  return HttpRequest.post(
    {
      url: RoleApi.getUserNotInRoleByPage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
/**
 * 验证角色编码是否存在
 * @param params 角色编码
 * @returns 结果
 */
export const checkRoleCodeExist = (params: any) => {
  return HttpRequest.get(
    {
      url: RoleApi.checkRoleCodeExist,
      params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
