import { HttpRequest } from '@/utils/request'
import type { Response } from '@/types/global'
import type { OrderSearchParams } from './type'

/**
 * 枚举订单需要的接口地址
 */
export enum OrderApi {
  /**
   * 公司列表
   */
  affiliate = '/staff/customer/affiliate/list',
  /**
   * 用户列表
   */
  customer = '/staff/customer/list',
  /**
   * 港口列表
   */
  port = '/common/location/list',
  /**
   * 船司列表（全）
   */
  carrierAll = '/common/carrier/list',
  /**
   * 船司列表（下单）
   */
  carrier = '/common/carrier/brand/list',
  /**
   * 订单列表（普通）
   */
  order = '/staff/frt/order/page',
  /**
   * 光速预定
   */
  fastOrder = '/staff/order/page',
  /**
   * 导出光速预定
   */
  exportFastOrder = '/staff/order/fastbooking/export',
  /**
   * 导出光速预定订单结果
   */
  exportFastOrderResult = '/staff/order/download/booking',
  /**
   * 拍舱结果列表
   */
  cabinResult = '/staff/fast/booking/page',
  /**
   * 导入拍舱结果
   */
  importCabinResult = '/staff/fast/booking/upload/excel/',
  /**
   * 批量发布舱位
   */
  batchProduct = '/staff/fast/booking/publish/product',
  /**
   * 取消关联舱位
   */
  onRelevance = '/staff/fast/booking/unbind',
}

/**
 * 查询公司列表
 */
export const getSearchAffiliate = (params: { keyword?: string }) => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.affiliate,
      params: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询用户列表
 */
export const getSearchCustomer = (params: { keyword?: string }) => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.customer,
      params: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询港口列表
 */
export const getSearchPort = (params: { keyword?: string; tag: string }) => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.port,
      params: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询船司列表
 */
export const getSearchCarrierAll = () => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.carrierAll,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询船司列表
 */
export const getSearchCarrier = () => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.carrier,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询订单列表（普通）
 * @param params
 * @returns
 */

export const getOrderOptions = (params: OrderSearchParams) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) }
  return HttpRequest.get<Response>(
    {
      url: OrderApi.order,
      params: qsParams,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询光速预定
 * @param params
 * @returns
 */

export const getFastOrderOptions = (params: OrderSearchParams) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) }
  return HttpRequest.get<Response>(
    {
      url: OrderApi.fastOrder,
      params: qsParams,
    },
    { isTransformResponse: false }
  )
}

/**
 * 导出光速预定列表
 * @param params
 * @returns
 */

export const downFastOrder = (params: { ids: string }) => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.exportFastOrder,
      params: params,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  )
}

/**
 * 导出光速预定订单结果
 * @param params
 * @returns
 */

export const downOrderResult = (params: { ids: string }) => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.exportFastOrderResult,
      params: params,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询拍舱结果
 * @param params
 * @returns
 */

export const getCabinResultOptions = (params: OrderSearchParams) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) }
  return HttpRequest.get<Response>(
    {
      url: OrderApi.cabinResult,
      params: qsParams,
    },
    { isTransformResponse: false }
  )
}

/**
 * 导入拍舱结果
 * @param data
 * @returns
 */

export const postCabinResult = (data: any) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.importCabinResult,
      data: data,
    },
    { isTransformResponse: false }
  )
}

/**
 * 批量发布舱位
 * @param data
 * @returns
 */

export const postBatchProduct = (data: string[]) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.batchProduct,
      data: data,
    },
    { isTransformResponse: false }
  )
}

/**
 * 取消关联舱位
 * @param data
 * @returns
 */

export const postOnRelevance = (data: { ids: string[] }) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.onRelevance,
      data: data,
    },
    { isTransformResponse: false }
  )
}
