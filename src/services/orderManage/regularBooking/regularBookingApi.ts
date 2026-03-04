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
 * @description 查询公司列表
 * @param params 查询公司参数
 * @returns 公司列表
 */
export const getSearchAffiliate = (params: { keyword?: string }) => {
  return HttpRequest.get<Response>(
    {
      url: RegularBookingAPi.affiliate,
      params: params,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 查询用户列表
 * @param params 查询用户参数
 * @returns 用户列表
 */
export const getSearchCustomer = (params: { keyword?: string }) => {
  return HttpRequest.get(
    {
      url: RegularBookingAPi.customer,
      params: params,
    },
    { isTransformResponse: false },
  );
};

/**
 * 查询订单列表（普通）
 * @param params 查询订单参数
 * @returns 订单列表
 */

export const getRegularBookingByPage = (params: RegularBookingSearchParams) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) };
  return HttpRequest.get<Response>(
    {
      url: RegularBookingAPi.RegularBookingByPage,
      params: qsParams,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 查询订单详情（普通）
 * @param id 订单id
 * @returns 订单详情
 */

export const getRegularBookingDetail = (id: string) => {
  return HttpRequest.get<Response>(
    {
      url: RegularBookingAPi.RegularBookingDetail + id,
    },
    { isTransformResponse: false },
  );
};

/**
 * 取消订舱
 * @param data 取消订舱参数
 * @returns 取消订舱结果
 */

export const postCancelBooking = (
  id: string | number,
  data: { remark: string },
) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.cancelBooking + id,
      data: data,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 开启订舱 接受订单, 订单状态转为处理中
 * @param id 订单id
 * @returns 开启订舱结果
 */

export const postStartBooking = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.startBooking + id,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 订舱成功
 * @param id 订单id
 * @returns 订舱成功结果
 */

export const postBookingSuccess = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.settingBookingSuccess + id,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 订舱执行违约
 * @param id 订单id
 * @param data 执行违约参数
 * @returns 执行违约结果
 */

export const postExecutionBreach = (
  id: string | number,
  data: { remark: string },
) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.executionBreach + id,
      data: data,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 订舱执行退款
 * @param id 订单id
 * @returns 执行退款结果
 */

export const postBookingRefund = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.bookingRefund + id,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 订舱执行结束
 * @param id 订单id
 * @returns 执行结束结果
 */

export const postBookingFinish = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.bookingFinish + id,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 订舱同意取消
 * @param id 订单id
 * @returns 同意取消结果
 */

export const postAgreeCancelApply = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.agreeCancelApply + id,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 订舱拒绝取消
 * @param id 订单id
 * @param data 拒绝取消参数
 * @returns 拒绝取消结果
 */

export const postRejectCancelApply = (
  id: string | number,
  data: { remark: string },
) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.rejectCancelApply + id,
      data: data,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 登陆订舱账号
 * @param id 订单id
 * @returns 登陆订舱账号结果
 */

export const postLoginOrderAccount = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.loginOrderAccount + id,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 修改订舱频率
 * @param id 订单id
 * @param data 修改订舱频率参数
 * @returns 修改订舱频率结果
 */

export const postBookingFrequency = (
  id: string | number,
  data: Partial<{
    cronPattern: string;
    frequencyType: string;
    hourRange: string;
  }>,
) => {
  return HttpRequest.post<Response>(
    {
      url: RegularBookingAPi.editBookingFrequency + id,
      data: data,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 查询船期数据
 * @param params 查询船期参数
 * @returns 船期数据
 */

export const getShippingSchedule = (params: ShippingScheduleParams) => {
  // let qsParams = { ...params, filter: JSON.stringify(params.filter) }
  return HttpRequest.get<Response>(
    {
      url: RegularBookingAPi.shippingSchedule,
      params: params,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 查询船期数据
 * @param params 查询船期参数
 * @returns 船期数据
 */

export const getSearchRoutePage = (params: SearchRoutePageType) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) };
  return HttpRequest.get<Response>(
    {
      url: RegularBookingAPi.SearchRoutePage,
      params: qsParams,
    },
    { isTransformResponse: false },
  );
};
