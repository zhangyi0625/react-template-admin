import { HttpRequest } from '@/utils/request';
import type {
  ServiceChargeManageSearchParams,
  ServiceChargeManageEditType,
  ServiceChargeFeeItems,
} from './serviceChargeManageModel';

/**
 * 枚举服务费保证金管理相关的api
 */
export enum ServiceChargeManageApi {
  ServiceChargeManage = '/staff/service-fee/',
  ServiceChargeManageByList = '/staff/service-fee/page',
}

/**
 * 查询服务费保证金管理数据
 * @returns 服务费保证金管理列表
 */
export const getServiceChargeManageByList = (
  params: ServiceChargeManageSearchParams
) => {
  return HttpRequest.get(
    {
      url: ServiceChargeManageApi.ServiceChargeManageByList,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 查询服务费保证金明细
 * @returns 服务费保证金管理列表
 */
export const getServiceChargeManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: ServiceChargeManageApi.ServiceChargeManage + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增服务费保证金规则
 * @param params 服务费保证金管理参数
 * @returns 服务费保证金管理列表
 */
export const addServiceCharge = (params: ServiceChargeManageEditType) => {
  return HttpRequest.post(
    {
      url: ServiceChargeManageApi.ServiceChargeManage,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 修改服务费保证金规则
 * @param params 服务费保证金管理参数
 * @returns 服务费保证金管理列表
 */
export const updateServiceCharge = (
  params: ServiceChargeManageEditType,
  id: string
) => {
  return HttpRequest.put(
    {
      url: ServiceChargeManageApi.ServiceChargeManage + id,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 修改服务费保证金明细
 * @param params 服务费保证金管理参数
 * @returns 服务费保证金管理列表
 */
export const updateServiceChargeItems = (
  params: ServiceChargeFeeItems[],
  id: string
) => {
  return HttpRequest.put(
    {
      url: ServiceChargeManageApi.ServiceChargeManage + id + '/items',
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 删除服务费保证金规则
 * @returns 服务费保证金管理列表
 */
export const deleteServiceChargeManageDetail = (id: string) => {
  return HttpRequest.delete(
    {
      url: ServiceChargeManageApi.ServiceChargeManage + id,
    },
    {
      isTransformResponse: false,
    }
  );
};
