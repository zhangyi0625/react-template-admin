import { HttpRequest } from '@/utils/request';
import type {
  DepositManageSearchParams,
  DepositManageType,
} from './depositManageModel';

/**
 * 枚举提现管理相关的api
 */
export enum DepositManageApi {
  DepositManage = '/staff/customer/fund/discharge/',
  DepositManageByPage = '/staff/customer/fund/discharge/page',
}

/**
 * @description 分页获取提现管理列表
 * @param params 提现管理参数
 * @returns 提现管理列表
 */
export const getDepositManageListByPage = (
  params: DepositManageSearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: DepositManageApi.DepositManageByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取提现管理
 * @param id 提现管理参数
 * @returns 提现管理列表
 */
export const getDepositManage = (id: string) => {
  return HttpRequest.get(
    {
      url: DepositManageApi.DepositManage + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 提现管理 接受提现
 * @param params 提现管理参数
 * @returns 提现管理列表
 */
export const postAcceptDepositManage = (params: DepositManageType) => {
  return HttpRequest.post(
    {
      url: DepositManageApi.DepositManage + params.id + '/ok',
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 提现管理 拒绝提现
 * @param params 提现管理参数
 * @returns 提现管理列表
 */
export const postRejectDepositManage = (params: DepositManageType) => {
  return HttpRequest.post(
    {
      url: DepositManageApi.DepositManage + params.id + '/failed',
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};
