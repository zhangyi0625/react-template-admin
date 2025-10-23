import { HttpRequest } from '@/utils/request'
import type { ServiceSettingType } from '@/services/serviceSetting/serviceSettingModel'

/**
 * 枚举系统配置需要的接口地址
 */
export enum ServiceSettingApi {
  serviceSetting = '/core/business/mq-service-config',
}

/**
 * 查询服务配置
 */
export const getServiceSetting = () => {
  return HttpRequest.get(
    {
      url: ServiceSettingApi.serviceSetting,
    },
    { isTransformResponse: false }
  )
}

/**
 * 添加服务配置
 */
export const addServiceSetting = (params: ServiceSettingType) => {
  return HttpRequest.post(
    {
      url: ServiceSettingApi.serviceSetting,
      data: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 修改服务配置
 */
export const updateServiceSetting = (params: ServiceSettingType) => {
  return HttpRequest.put(
    {
      url: ServiceSettingApi.serviceSetting,
      data: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 删除服务设置
 */
export const deleteServiceSetting = (id: string) => {
  return HttpRequest.delete(
    {
      url: ServiceSettingApi.serviceSetting + '/' + id,
    },
    { isTransformResponse: false }
  )
}
