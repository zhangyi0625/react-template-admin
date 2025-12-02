import { HttpRequest } from '@/utils/request';
import type { Response } from '@/types/global';
import type {
  RegularBookingSearchParams,
  SearchRoutePageType,
  ShippingScheduleParams,
} from './regularBookingModel';

/**
 * 枚举普通订单需要的接口地址
 */
export enum RegularBookingAPi {
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
   * 订单列表（普通）
   */
  RegularBookingByPage = '/staff/frt/order/page',
  /**
   * 订单列表详情（普通）
   */
  RegularBookingDetail = '/staff/frt/order/detail/',
  /**
   * 取消订舱
   */
  cancelBooking = '/staff/frt/order/closure/',
  /**
   * 审核通过开启订舱
   */
  startBooking = '/staff/frt/order/start/',
  /**
   * 设置订舱成功
   */
  settingBookingSuccess = '/staff/frt/order/success/',
  /**
   * 订舱执行违约
   */
  executionBreach = '/staff/frt/order/violated/',
  /**
   * 订单退款
   */
  bookingRefund = '/staff/frt/order/chargeback/',
  /**
   * 订单完成
   */
  bookingFinish = '/staff/frt/order/finish/',
  /**
   * 同意取消申请
   */
  agreeCancelApply = '/staff/frt/order/cancel/pass/',
  /**
   * 拒绝取消申请
   */
  rejectCancelApply = 'staff/frt/order/cancel/forbid/',
  /**
   * 登陆订单船司账号
   */
  loginOrderAccount = '/staff/frt/order/verify/account/',
  /**
   * 修改订舱频率
   */
  editBookingFrequency = '/staff/frt/order/prebooking/cron/',

  /**
   * 船期数据
   */
  shippingSchedule = '/staff/product/getSchedules',
  /**
   * 查询航线列表
   */
  SearchRoutePage = '/staff/product/search/page',
}

/**
 * 查询公司列表
 */
export const getSearchAffiliate = (params: { keyword?: string }) => {
  return HttpRequest.get<Response>(
    {
      url: RegularBookingAPi.affiliate,
      params: params,
    },
    { isTransformResponse: false }
  );
};

/**
 * 查询用户列表
 */
export const getSearchCustomer = (params: { keyword?: string }) => {
  return HttpRequest.get(
    {
      url: RegularBookingAPi.customer,
      params: params,
    },
    { isTransformResponse: false }
  );
};

/**
 * 查询港口列表
 */
export const getSearchPort = (params: { keyword?: string; tag?: string }) => {
  return HttpRequest.get(
    {
      url: RegularBookingAPi.port,
      params: params,
    },
    { isTransformResponse: false }
  );
};

/**
 * 查询订单列表（普通）
 * @param params
 * @returns
 */

export const getRegularBookingByPage = (params: RegularBookingSearchParams) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) };
  return HttpRequest.get<Response>(
    {
      url: RegularBookingAPi.RegularBookingByPage,
      params: qsParams,
    },
    { isTransformResponse: false }
  );
};

/**
 * 查询订单详情（普通）
 * @param id
 * @returns
 */

export const getRegularBookingDetail = (id: string) => {
  return HttpRequest.get<Response>(
    {
      url: RegularBookingAPi.RegularBookingDetail + id,
    },
    { isTransformResponse: false }
  );
};

/**
 * 取消订舱
 * @param data
 * @returns
 */

export const postCancelBooking = (
  id: string | number,
  data: { remark: string }
) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.cancelBooking + id,
      data: data,
    },
    { isTransformResponse: false }
  );
};

/**
 * 开启订舱 接受订单, 订单状态转为处理中
 * @param id
 * @returns
 */

export const postStartBooking = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.startBooking + id,
    },
    { isTransformResponse: false }
  );
};

/**
 * 订舱成功
 * @param id
 * @returns
 */

export const postBookingSuccess = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.settingBookingSuccess + id,
    },
    { isTransformResponse: false }
  );
};

/**
 * 订舱执行违约
 * @param data
 * @returns
 */

export const postExecutionBreach = (
  id: string | number,
  data: { remark: string }
) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.executionBreach + id,
      data: data,
    },
    { isTransformResponse: false }
  );
};

/**
 * 订舱执行退款
 * @param id
 * @returns
 */

export const postBookingRefund = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.bookingRefund + id,
    },
    { isTransformResponse: false }
  );
};

/**
 * 订舱执行结束
 * @param id
 * @returns
 */

export const postBookingFinish = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.bookingFinish + id,
    },
    { isTransformResponse: false }
  );
};

/**
 * 订舱同意取消
 * @param id
 * @returns
 */

export const postAgreeCancelApply = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.agreeCancelApply + id,
    },
    { isTransformResponse: false }
  );
};

/**
 * 订舱拒绝取消
 * @param data
 * @returns
 */

export const postRejectCancelApply = (
  id: string | number,
  data: { remark: string }
) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.rejectCancelApply + id,
      data: data,
    },
    { isTransformResponse: false }
  );
};

/**
 * 登陆订舱账号
 * @param id
 * @returns
 */

export const postLoginOrderAccount = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.loginOrderAccount + id,
    },
    { isTransformResponse: false }
  );
};

/**
 * 修改订舱频率
 * @param data
 * @returns
 */

export const postBookingFrequency = (
  id: string | number,
  data: Partial<{
    cronPattern: string;
    frequencyType: string;
    hourRange: string;
  }>
) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.editBookingFrequency + id,
      data: data,
    },
    { isTransformResponse: false }
  );
};

/**
 * 查询船期数据
 * @param params
 * @returns
 */

export const getShippingSchedule = (params: ShippingScheduleParams) => {
  // let qsParams = { ...params, filter: JSON.stringify(params.filter) }
  return HttpRequest.get<Response>(
    {
      url: RegularBookingAPi.shippingSchedule,
      params: params,
    },
    { isTransformResponse: false }
  );
};

/**
 * 查询船期数据
 * @param params
 * @returns
 */

export const getSearchRoutePage = (params: SearchRoutePageType) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) };
  return HttpRequest.get<Response>(
    {
      url: RegularBookingAPi.SearchRoutePage,
      params: qsParams,
    },
    { isTransformResponse: false }
  );
};
