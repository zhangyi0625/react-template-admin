import { HttpRequest } from '@/utils/request';
import type { Response } from '@/types/global';
import type { RegularBookingSearchParams } from '../regularBooking/regularBookingModel';

/**
 * 枚举光速预定订单需要的接口地址
 */
export enum FastBookingAPi {
  /**
   * 光速预定
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
}

/**
 * 查询光速预定
 * @param params
 * @returns
 */

export const getFastBooingByPage = (params: RegularBookingSearchParams) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) };
  return HttpRequest.get<Response>(
    {
      url: FastBookingAPi.FastBooingByPage,
      params: qsParams,
    },
    { isTransformResponse: false }
  );
};

/**
 * 导出光速预定列表
 * @param params
 * @returns
 */

export const downFastOrder = (params: { ids: string }) => {
  return HttpRequest.get<Response>(
    {
      url: FastBookingAPi.ExportFastOrder,
      params: params,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  );
};

/**
 * 导出光速预定订单结果
 * @param params
 * @returns
 */

export const downOrderResult = (params: { ids: string }) => {
  return HttpRequest.get<Response>(
    {
      url: FastBookingAPi.ExportFastOrderResult,
      params: params,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  );
};
