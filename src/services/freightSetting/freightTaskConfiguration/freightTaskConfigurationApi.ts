import { HttpRequest } from '@/utils/request';
import type {
  FreightTaskConfigurationSearchParams,
  FreightTaskConfigurationType,
} from './freightTaskConfigurationModel';

/**
 * 枚举运价任务配置相关的api
 */
export enum FreightTaskConfigurationApi {
  FreightTaskConfiguration = '/staff/group/',
  FreightTaskConfigurationByPage = '/staff/group/page',
  AddFreightTaskConfiguration = '/staff/group/add',
}

/**
 * 分页获取运价任务配置列表
 * @param params 运价任务配置参数
 * @returns 运价任务配置列表
 */
export const getFreightTaskConfigurationListByPage = (
  params: FreightTaskConfigurationSearchParams
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: FreightTaskConfigurationApi.FreightTaskConfigurationByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增运价任务配置列表
 * @param params 运价任务配置参数
 * @returns 运价任务配置列表
 */
export const addFreightTaskConfiguration = (
  params: FreightTaskConfigurationType
) => {
  return HttpRequest.post(
    {
      url: FreightTaskConfigurationApi.AddFreightTaskConfiguration,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 修改运价任务配置列表
 * @param params 运价任务配置参数
 * @returns 运价任务配置列表
 */
export const putFreightTaskConfiguration = (
  params: FreightTaskConfigurationType
) => {
  return HttpRequest.put(
    {
      url: FreightTaskConfigurationApi.FreightTaskConfiguration + params.id,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 删除运价任务配置列表
 * @param params 运价任务配置参数
 * @returns 运价任务配置列表
 */
export const deleteFreightTaskConfiguration = (id: string) => {
  return HttpRequest.delete(
    {
      url: FreightTaskConfigurationApi.FreightTaskConfiguration + id,
    },
    {
      isTransformResponse: false,
    }
  );
};
