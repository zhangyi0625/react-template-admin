import { HttpRequest } from '@/utils/request'
import type { SysOrganizationType } from './organizationModel'

/**
 * 枚举角色相关的api
 */
export enum OrganizationApi {
  organizationList = '/api/system/org/list',
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
