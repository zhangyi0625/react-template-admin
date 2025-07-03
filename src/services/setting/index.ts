import { HttpRequest } from '@/utils/request'
import type { Response } from '@/types/global'

/**
 * 枚举系统配置需要的接口地址
 */
export enum PublicApi {
  publicData = '/common/public-data',
  publicSetting = '/common/public-settings',
}

/**
 * 查询系统参数
 */
export const getPublicData = () => {
  return HttpRequest.get<Response>(
    {
      url: PublicApi.publicData,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询系统配置
 */
export const getPublicSetting = () => {
  return HttpRequest.get<Response>(
    {
      url: PublicApi.publicSetting,
    },
    { isTransformResponse: false }
  )
}
