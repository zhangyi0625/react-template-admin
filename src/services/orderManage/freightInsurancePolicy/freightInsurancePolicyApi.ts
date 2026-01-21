import { HttpRequest } from '@/utils/request';
import type { Response } from '@/types/global';
import type { FreightInsurancePolicySearchParams } from './freightInsurancePolicyModel';

/**
 * 枚举货运保险单订单需要的接口地址
 */
export enum FreightInsurancePolicyAPI {
  /**
   * 货运保险单订单列表
   */
  FreightInsurancePolicy = '/staff/insurance/',
  /**
   * 货运保险单订单分页列表
   */
  FreightInsurancePolicyByPage = '/staff/insurance/page',
  /**
   * 货运保险单订单详情
   */
  FreightInsurancePolicyDetail = '/staff/insurance/detail/',
}

/**
 * 分页查询货运保险单订单列表
 * @param params
 * @returns
 */

export const getFreightInsurancePolicyByPage = (
  params: FreightInsurancePolicySearchParams,
) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) };
  return HttpRequest.get<Response>(
    {
      url: FreightInsurancePolicyAPI.FreightInsurancePolicyByPage,
      params: qsParams,
    },
    { isTransformResponse: false },
  );
};

/**
 * 货运保险单订单列表详情
 * @param id
 * @returns
 */

export const getFreightInsurancePolicyDetail = (id: string) => {
  return HttpRequest.get<Response>(
    {
      url: FreightInsurancePolicyAPI.FreightInsurancePolicyDetail + id,
    },
    { isTransformResponse: false },
  );
};
