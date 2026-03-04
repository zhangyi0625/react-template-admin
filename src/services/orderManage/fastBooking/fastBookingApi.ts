import { HttpRequest } from '@/utils/request';
import type { Response } from '@/types/global';
import type { RegularBookingSearchParams } from '../regularBooking/regularBookingModel';
import type {
  FastBookingCabinResultParams,
  FastBookingOrderAccountParams,
} from './fastBookingModel';
import { ContentTypeEnum } from '@/enums/httpEnum';

/**
 * 枚举光速预定订单需要的接口地址
 */
export enum FastBookingAPi {
  /**
   * 光速预定分也查询
   */
  FastBooingByPage = '/staff/order/page',
  /**
   * 导出光速预定
   */
  ExportFastOrder = '/staff/order/fastbooking/export',
  /**
   * 导出光速预定订单结果
   */
  ExportFastOrderResult = '/staff/order/download/booking',
  /**
   * 光速预定详情
   */
  FastBookingDetail = '/staff/order/',
  /**
   * 光速预定下单船司账号
   */
  FastBookingOrderAccount = '/staff/carrier/account/list/v2',
  /**
   * 光速预定拍舱结果
   */
  FastBookingCabinResult = '/staff/booking/list',
  /**
   * 发送结果通知
   */
  SendFastBookingResult = '/staff/order/external/notify/',
  /**
   * 第三方拍舱接口（API 极虎）
   */
  FastBookingByOther = '/staff/order/prepare/fast/api',
}

/**
 * @description 查询光速预定
 * @param params 光速预定参数
 * @returns 光速预定列表
 */

export const getFastBooingByPage = (params: RegularBookingSearchParams) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) };
  return HttpRequest.get<Response>(
    {
      url: FastBookingAPi.FastBooingByPage,
      params: qsParams,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 导出光速预定列表
 * @param params 光速预定参数
 * @returns 光速预定列表
 */

export const downFastOrder = (params: { ids: string }) => {
  return HttpRequest.get<Response>(
    {
      url: FastBookingAPi.ExportFastOrder,
      params: params,
      responseType: 'blob',
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 导出光速预定订单结果
 * @param params 光速预定参数
 * @returns 光速预定列表
 */

export const downOrderResult = (params: { ids: string }) => {
  return HttpRequest.get<Response>(
    {
      url: FastBookingAPi.ExportFastOrderResult,
      params: params,
      responseType: 'blob',
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 光速预定详情
 * @param id 光速预定参数
 * @returns 光速预定列表
 */

export const getFastBookingDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: FastBookingAPi.FastBookingDetail + id,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 光速预定动态记录
 * @param id 光速预定参数
 * @returns 光速预定列表
 */

export const getFastBookingEvents = (id: string) => {
  return HttpRequest.get(
    {
      url: FastBookingAPi.FastBookingDetail + id + '/events',
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 光速预定查询下单账号
 * @param params 光速预定参数
 * @returns 光速预定列表
 */

export const getFastBookingOrderAccount = (
  params: FastBookingOrderAccountParams,
) => {
  return HttpRequest.get(
    {
      url: FastBookingAPi.FastBookingOrderAccount,
      params: params,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 光速预定查询拍舱结果
 * @param params 光速预定参数
 * @returns 光速预定列表
 */

export const getFastBookingCabinResult = (
  params: FastBookingCabinResultParams,
) => {
  return HttpRequest.get(
    {
      url: FastBookingAPi.FastBookingCabinResult,
      params: params,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 光速预定结果通知
 * @param params 光速预定参数
 * @returns 光速预定列表
 */

export const postSendFastBookingResult = (
  params: { remark: string },
  id: string,
) => {
  return HttpRequest.post<Response>(
    {
      url: FastBookingAPi.SendFastBookingResult + id,
      params: params,
      headers: {
        'Content-Type': ContentTypeEnum.FORM_DATA,
      },
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 光速预定取消预订
 * @param id 光速预定参数
 * @returns 光速预定列表
 */

export const postFastBookingStatusByCancel = (id: string) => {
  return HttpRequest.post<Response>(
    {
      url: FastBookingAPi.FastBookingDetail + id + '/cancelled',
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 光速预定自有下单
 * @param id 光速预定参数
 * @returns 光速预定列表
 */

export const postFastBookingStatusByPreparing = (id: string) => {
  return HttpRequest.post<Response>(
    {
      url: FastBookingAPi.FastBookingDetail + id + 'preparing',
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 光速预定API极虎下单
 * @param id 光速预定参数
 * @returns 光速预定列表
 */

export const postFastBookingByOther = (id: string) => {
  return HttpRequest.post<Response>(
    {
      url: FastBookingAPi.FastBookingByOther + id,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 光速预定 设置订舱成功
 * @param id 光速预定参数
 * @returns 光速预定列表
 */

export const postFastBookingStatusByPrepared = (id: string) => {
  return HttpRequest.post<Response>(
    {
      url: FastBookingAPi.FastBookingDetail + id + 'prepared',
    },
    { isTransformResponse: false },
  );
};
