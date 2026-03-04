import { HttpRequest } from '@/utils/request';
import type {
  OurCompanyPortSearchParams,
  OurCompanyPortType,
} from './ourCompanyPortModel';

/**
 * 枚举我司港口相关的api
 */
export enum OurCompanyPortApi {
  OurCompanyPort = '/staff/location',
  OurCompanyPortByPage = '/staff/location/page',
}

/**
 * @description 分页获取我司港口列表
 * @param params 我司港口参数
 * @returns 我司港口列表
 */
export const getOurCompanyPortListByPage = (
  params: OurCompanyPortSearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: OurCompanyPortApi.OurCompanyPortByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 新增我司港口列表
 * @param params 我司港口参数
 * @returns 我司港口列表
 */
export const addOurCompanyPort = (params: OurCompanyPortType) => {
  return HttpRequest.post(
    {
      url: OurCompanyPortApi.OurCompanyPort,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 修改我司港口列表
 * @param params 我司港口参数
 * @returns 我司港口列表
 */
export const putOurCompanyPort = (params: OurCompanyPortType) => {
  return HttpRequest.put(
    {
      url: OurCompanyPortApi.OurCompanyPort + '/' + params.id,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 删除我司港口列表
 * @param id 我司港口id
 * @returns 我司港口列表
 */
export const deleteOurCompanyPort = (id: string) => {
  return HttpRequest.delete(
    {
      url: OurCompanyPortApi.OurCompanyPort + '/' + id,
    },
    {
      isTransformResponse: false,
    },
  );
};
