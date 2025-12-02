import { HttpRequest } from '@/utils/request';
import {
  SystemAreaOptionsType,
  SystemCarrierOptionsType,
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
  /**
   * 系统全部船司列表
   */
  SystemAllCarrier = '/common/carrier/list',
  /**
   * 系统下单船司列表
   */
  SystemOrderCarrier = '/common/carrier/brand/list',
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

/**
 * 系统全部船司列表
 */
export const getSystemAllCarrier = () => {
  return HttpRequest.get<SystemCarrierOptionsType[]>(
    {
      url: SystemBasicDataApi.SystemAllCarrier,
    },
    { isTransformResponse: false }
  );
};

/**
 * 系统下单船司列表
 */
export const getSystemOrderCarrier = () => {
  return HttpRequest.get<SystemCarrierOptionsType[]>(
    {
      url: SystemBasicDataApi.SystemOrderCarrier,
    },
    { isTransformResponse: false }
  );
};
