import { HttpRequest } from '@/utils/request';
import type {
  FinancialDetailsSearchParams,
  FinancialDetailsType,
} from './financialDetailsModel';

/**
 * 枚举资金明细相关的api
 */
export enum FinancialDetailsApi {
  FinancialDetails = '/staff/customer/fund/recharge',
  FinancialDetailsByPage = '/staff/customer/fund/recharge/page',
}

/**
 * @description 分页获取资金明细列表
 * @param params 资金明细参数
 * @returns 资金明细列表
 */
export const getFinancialDetailsListByPage = (
  params: FinancialDetailsSearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: FinancialDetailsApi.FinancialDetailsByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取资金明细
 * @param id 资金明细参数
 * @returns 资金明细列表
 */
export const getFinancialDetails = (id: string) => {
  return HttpRequest.get(
    {
      url: FinancialDetailsApi.FinancialDetails + '/' + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 新增资金明细列表
 * @param params 资金明细参数
 * @returns 资金明细列表
 */
export const addFinancialDetails = (params: FinancialDetailsType) => {
  return HttpRequest.post(
    {
      url: FinancialDetailsApi.FinancialDetails,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 修改资金明细列表
 * @param params 资金明细参数
 * @returns 资金明细列表
 */
export const putFinancialDetails = (params: FinancialDetailsType) => {
  return HttpRequest.put(
    {
      url: FinancialDetailsApi.FinancialDetails + params.id,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 删除资金明细列表
 * @param params 资金明细参数
 * @returns 资金明细列表
 */
export const deleteFinancialDetails = (id: string) => {
  return HttpRequest.delete(
    {
      url: FinancialDetailsApi.FinancialDetails + id,
    },
    {
      isTransformResponse: false,
    },
  );
};
