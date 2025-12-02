import { HttpRequest } from '@/utils/request';
import {
  SystemAreaOptionsType,
  SystemCountryOptionsType,
} from './basicDataModel';

export enum SystemBasicDataApi {
  /**
   * 系统航线列表
   */
  SystemAreaOptions = '/common/location/area/list',
  /**
   * 系统国家列表
   */
  SystemCountryOptions = '/common/location/country/list',
}

/**
 * 查询系统航线列表
 * @param params  航线列表查询参数
 * @returns 航线列表
 */
export const getSystemAreaOptions = (params?: { parentId: number }) => {
  return HttpRequest.get<SystemAreaOptionsType[]>(
    {
      url: SystemBasicDataApi.SystemAreaOptions,
      params: params,
    },
    { isTransformResponse: false }
  );
};

/**
 * 查询系统航线列表
 * @param params  航线列表查询参数
 * @returns 航线列表
 */
export const getSystemCountryOptions = () => {
  return HttpRequest.get<SystemCountryOptionsType[]>(
    {
      url: SystemBasicDataApi.SystemCountryOptions,
    },
    { isTransformResponse: false }
  );
};
