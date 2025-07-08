import { HttpRequest } from '@/utils/request'
import { CustomerManageParams, CustomerManageType } from './customerManageModel'

/**
 * 枚举客户管理相关的api
 */
export enum CustomerManageApi {
  customerManageList = '/system/test/customer',
  addCustomerManage = '/system/test/add/customer',
  deleteCustomerManage = '/system/test/customer/',
}

/**
 * 获取客户管理列表
 * @param params 客户管理参数
 * @returns 客户管理列表
 */
export const getCustomerManageList = (params: CustomerManageParams) => {
  return HttpRequest.get(
    {
      url: CustomerManageApi.customerManageList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加客户
 * @param params 客户管理参数
 * @returns
 */
export const addCustomerManage = (params: CustomerManageType) => {
  return HttpRequest.post(
    {
      url: CustomerManageApi.addCustomerManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除客户
 * @param params 客户管理参数
 * @returns
 */
export const deleteCustomerManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: CustomerManageApi.deleteCustomerManage + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
