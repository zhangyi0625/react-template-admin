import { HttpRequest } from '@/utils/request';
import type {
  ShippingCompanyPortSearchParams,
  ShippingCompanyPortType,
} from './shippingCompanyPortModel';

/**
 * 枚举船司港口相关的api
 */
export enum ShippingCompanyPortApi {
  ShippingCompanyPort = '/staff/carrier/location',
  ShippingCompanyPortByPage = '/staff/carrier/location/page',
  AddShippingCompanyPort = '/staff/carrier/location/add',
  PutShippingCompanyPort = '/staff/carrier/location/',
}

/**
 * @description 分页获取船司港口列表
 * @param params 船司港口参数
 * @returns 船司港口列表
 */
export const getShippingCompanyPortListByPage = (
  params: ShippingCompanyPortSearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: ShippingCompanyPortApi.ShippingCompanyPortByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 新增船司港口列表
 * @param params 船司港口参数
 * @returns 船司港口列表
 */
export const addShippingCompanyPort = (params: ShippingCompanyPortType) => {
  return HttpRequest.post(
    {
      url: ShippingCompanyPortApi.AddShippingCompanyPort,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 修改船司港口列表
 * @param params 船司港口参数
 * @returns 船司港口列表
 */
export const putShippingCompanyPort = (params: ShippingCompanyPortType) => {
  return HttpRequest.post(
    {
      url:
        ShippingCompanyPortApi.PutShippingCompanyPort +
        params.id +
        '?locationId=' +
        params.locationId,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 删除船司港口列表
 * @param id 船司港口id
 * @returns 船司港口列表
 */
export const deleteShippingCompanyPort = (id: string) => {
  return HttpRequest.delete(
    {
      url: ShippingCompanyPortApi.ShippingCompanyPort + '/' + id,
    },
    {
      isTransformResponse: false,
    },
  );
};
