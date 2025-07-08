import { HttpRequest } from '@/utils/request'
import {
  ShippingAccounParams,
  ShippingAccounType,
} from './shippingAccountModel'

/**
 * 枚举船司账号相关的api
 */
export enum ShippingAccountApi {
  carrierList = '/system/test/carrier',
  shippingAccountList = '/system/test/shippingAccount',
  addShippingAccount = '/system/test/add/shippingAccount',
}

/**
 * 获取船司分类列表
 * @returns 船司分类列表
 */
export const getCarrierList = () => {
  return HttpRequest.get(
    {
      url: ShippingAccountApi.carrierList,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取船司账号列表
 * @param params 船司账号参数
 * @returns 船司账号列表
 */
export const getShippingAccountList = (params: ShippingAccounParams) => {
  return HttpRequest.get(
    {
      url: ShippingAccountApi.shippingAccountList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加船司账号
 * @param params 船司账号参数
 * @returns
 */
export const addDictionary = (params: ShippingAccounType) => {
  return HttpRequest.post(
    {
      url: ShippingAccountApi.addShippingAccount,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
