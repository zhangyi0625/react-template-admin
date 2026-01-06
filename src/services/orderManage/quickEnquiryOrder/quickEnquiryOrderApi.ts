import { HttpRequest } from '@/utils/request';
import type { Response } from '@/types/global';
import type { QuickEnquiryOrderSearchParams } from './quickEnquiryOrderModel';

/**
 * 枚举找舱订单需要的接口地址
 */
export enum QuickEnquiryOrderAPI {
  /**
   * 找舱订单列表
   */
  QuickEnquiryOrder = '/staff/quotation/',
  /**
   * 找舱订单分页列表
   */
  QuickEnquiryOrderByPage = '/staff/quotation/page',
  /**
   * 找舱订单报价记录
   */
  QuickEnquiryOrderRecords = '/staff/quotation/records/',
  /**
   * 找舱订单事件记录
   */
  QuickEnquiryOrderEvents = '/staff/quotation/events/',
  /**
   * 发送客服消息
   */
  QuickEnquiryOrderNotifyMsg = '/staff/quotation/notify/msg/',
  /**
   * 取消找舱订单
   */
  QuickEnquiryOrderCancel = '/staff/quotation/cancel/',
}

/**
 * 分页查询找舱订单列表
 * @param params
 * @returns
 */

export const getQuickEnquiryOrderByPage = (
  params: QuickEnquiryOrderSearchParams
) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) };
  return HttpRequest.get<Response>(
    {
      url: QuickEnquiryOrderAPI.QuickEnquiryOrderByPage,
      params: qsParams,
    },
    { isTransformResponse: false }
  );
};

/**
 * 找舱订单列表详情
 * @param id
 * @returns
 */

export const getQuickEnquiryOrderDetail = (id: string) => {
  return HttpRequest.get<Response>(
    {
      url: QuickEnquiryOrderAPI.QuickEnquiryOrder + id,
    },
    { isTransformResponse: false }
  );
};

/**
 * 找舱订单报价记录
 * @param id
 * @returns
 */

export const getQuickEnquiryOrderRecords = (id: string) => {
  return HttpRequest.get<Response>(
    {
      url: QuickEnquiryOrderAPI.QuickEnquiryOrderRecords + id,
    },
    { isTransformResponse: false }
  );
};

/**
 * 找舱订单事件记录
 * @param id
 * @returns
 */

export const getQuickEnquiryOrderEvents = (id: string) => {
  return HttpRequest.get<Response>(
    {
      url: QuickEnquiryOrderAPI.QuickEnquiryOrderEvents + id,
    },
    { isTransformResponse: false }
  );
};

/**
 * 发送客服消息
 * @param params 客服消息参数
 * @param id 找舱订单id
 * @returns
 */

export const postQuickEnquiryOrderNotifyMsg = (
  params: { content: string },
  id: string
) => {
  return HttpRequest.post<Response>(
    {
      url: QuickEnquiryOrderAPI.QuickEnquiryOrderNotifyMsg + id,
      params,
    },
    { isTransformResponse: false }
  );
};

/**
 * 取消找舱订单
 * @param id
 * @returns
 */

export const putQuickEnquiryOrderCancel = (id: string) => {
  return HttpRequest.put<Response>(
    {
      url: QuickEnquiryOrderAPI.QuickEnquiryOrderCancel + id,
    },
    { isTransformResponse: false }
  );
};
