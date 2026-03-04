import { HttpRequest } from '@/utils/request';
import type {
  ShippingCabinPlanType,
  ShippingCabinPlanSearchParams,
} from './shippingCabinPlanModel';

/**
 * 枚举船司舱位计划相关的api
 */
export enum ShippingCabinPlanApi {
  ShippingCarrierCabinPlanByPage = '/staff/carrier/product/plan/page',
  ShippingCabinPlan = '/staff/product/plan/',
  ShippingCabinPlanByPage = '/staff/product/plan/page',
}

/**
 * @description 分页获取船司舱位计划列表
 * @param params 船司舱位计划参数
 * @returns 船司舱位计划列表
 */
export const getShippingCarrierCabinPlanByPage = (
  params: ShippingCabinPlanSearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: ShippingCabinPlanApi.ShippingCarrierCabinPlanByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 分页获取维护放舱计划列表
 * @param params 船司舱位计划参数
 * @returns 船司舱位计划列表
 */
export const getShippingCabinPlanListByPage = (
  params: ShippingCabinPlanSearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: ShippingCabinPlanApi.ShippingCabinPlanByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 新增放舱计划
 * @param params 船司舱位计划参数
 * @returns 船司舱位计划列表
 */
export const postShippingCabinPlan = (params: ShippingCabinPlanType) => {
  return HttpRequest.post(
    {
      url: ShippingCabinPlanApi.ShippingCabinPlan + 'add',
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 修改放舱计划
 * @param params 船司舱位计划参数
 * @returns 船司舱位计划列表
 */
export const putShippingCabinPlan = (
  params: ShippingCabinPlanType,
  id: string,
) => {
  return HttpRequest.put(
    {
      url: ShippingCabinPlanApi.ShippingCabinPlan + id,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 船司舱位计划 删除船司航线
 * @param id 船司舱位计划参数
 * @returns 船司舱位计划列表
 */
export const deleteShippingCabinPlan = (id: string) => {
  return HttpRequest.delete(
    {
      url: ShippingCabinPlanApi.ShippingCabinPlan + id,
    },
    {
      isTransformResponse: false,
    },
  );
};
