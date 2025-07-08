import { HttpRequest } from '@/utils/request'
import type { SysOrganizationType } from './organizationModel'

/**
 * 枚举角色相关的api
 */
export enum OrganizationApi {
  organizationList = '/api/system/org/list',
  addOrganization = '/api/system/org/add',
  editOrganization = '/api/system/org/update',
  deleteOrganization = '/api/system/org/delete/',
}

/**
 * 租户列表
 * @param params 租户参数
 * @returns 租户列表
 */
export const getOrganizationList = (params?: SysOrganizationType) => {
  return HttpRequest.get(
    {
      url: OrganizationApi.organizationList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
/**
 * 新增租户
 * @param params 租户参数
 */
export const addOrganization = (params: SysOrganizationType) => {
  return HttpRequest.post(
    {
      url: OrganizationApi.addOrganization,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改租户
 * @param params 租户参数
 */
export const updateOrganization = (params?: SysOrganizationType) => {
  return HttpRequest.post(
    {
      url: OrganizationApi.editOrganization,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除租户
 * @param params 租户参数
 */
export const deleteOrganization = (id: string) => {
  return HttpRequest.get(
    {
      url: OrganizationApi.deleteOrganization + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
