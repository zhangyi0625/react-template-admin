import { HttpRequest } from '@/utils/request';
import type { ClientsCapitalSearchParams } from './clientsCapitalModel';

/**
 * 枚举客户资金相关的api
 */
export enum ClientsCapitalApi {
  ClientsCapital = '/staff/customer/fund/flow/',
  ClientsCapitalByPage = '/staff/customer/fund/flow//page',
}

/**
 * 分页获取客户资金列表
 * @param params 客户资金参数
 * @returns 客户资金列表
 */
export const getClientsCapitalListByPage = (
  params: ClientsCapitalSearchParams
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: ClientsCapitalApi.ClientsCapitalByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 获取客户资金
 * @param id 客户资金参数
 * @returns 客户资金列表
 */
export const getClientsCapital = (id: string) => {
  return HttpRequest.get(
    {
      url: ClientsCapitalApi.ClientsCapital + id,
    },
    {
      isTransformResponse: false,
    }
  );
};
