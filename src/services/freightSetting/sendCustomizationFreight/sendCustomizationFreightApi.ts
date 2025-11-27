import { HttpRequest } from '@/utils/request';
import type {
  SendCustomizationFreightSearchParams,
  SendCustomizationFreightType,
} from './sendCustomizationFreightModel';

/**
 * 枚举发送定制运价相关的api
 */
export enum SendCustomizationFreightApi {
  SendCustomizationFreight = '/staff/customized/freight/',
  SendCustomizationFreightByPage = '/staff/customized/freight/page',
  AddSendCustomizationFreight = '/staff/customized/freight//add',
}

/**
 * 分页获取发送定制运价列表
 * @param params 发送定制运价参数
 * @returns 发送定制运价列表
 */
export const getSendCustomizationFreightListByPage = (
  params: SendCustomizationFreightSearchParams
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: SendCustomizationFreightApi.SendCustomizationFreightByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增发送定制运价列表
 * @param params 发送定制运价参数
 * @returns 发送定制运价列表
 */
export const addSendCustomizationFreight = (
  params: SendCustomizationFreightType
) => {
  return HttpRequest.post(
    {
      url: SendCustomizationFreightApi.AddSendCustomizationFreight,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 修改发送定制运价列表
 * @param params 发送定制运价参数
 * @returns 发送定制运价列表
 */
export const putSendCustomizationFreight = (
  params: SendCustomizationFreightType
) => {
  return HttpRequest.put(
    {
      url: SendCustomizationFreightApi.SendCustomizationFreight + params.id,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 删除发送定制运价列表
 * @param params 发送定制运价参数
 * @returns 发送定制运价列表
 */
export const deleteSendCustomizationFreight = (id: string) => {
  return HttpRequest.delete(
    {
      url: SendCustomizationFreightApi.SendCustomizationFreight + id,
    },
    {
      isTransformResponse: false,
    }
  );
};
