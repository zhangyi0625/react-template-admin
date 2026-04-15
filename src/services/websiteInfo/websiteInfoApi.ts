import { HttpRequest } from '@/utils/request';
import type {
  ShipownerEncyclopediaType,
  ShippingCompanyZoneParams,
  ShippingCompanyZoneType,
  UserFeedbackParams,
} from './websiteInfoModel';

/**
 * 枚举官网信息管理相关的api
 */
export enum WebsiteInfoApi {
  UserFeedbackByPage = '/staff/feedback/page',
  ShippingCompanyZoneByPage = '/staff/carrier/page',
  AddShippingCompanyZone = '/staff/carrier',
  ShipownerEncyclopedia = '/staff/carrier/',
}

/**
 * @description 分页查询用户反馈列表
 * @param params 用户反馈参数
 * @returns 用户反馈列表
 */
export const getUserFeedbackByPage = (params: UserFeedbackParams) => {
  return HttpRequest.get(
    {
      url: WebsiteInfoApi.UserFeedbackByPage,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 分页查询船司专区数据
 * @param params 船司专区参数
 * @returns 船司专区列表
 */
export const getShippingCompanyZoneByPage = (
  params: ShippingCompanyZoneParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: WebsiteInfoApi.ShippingCompanyZoneByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 新增船司专区数据
 * @param params 船司专区参数
 * @returns 结果
 */
export const addShippingCompanyZone = (params: ShippingCompanyZoneType) => {
  return HttpRequest.post(
    {
      url: WebsiteInfoApi.AddShippingCompanyZone,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 修改船司专区数据
 * @param params 船司专区参数
 * @returns 结果
 */
export const updateShippingCompanyZone = (
  params: ShippingCompanyZoneType,
  id: string,
) => {
  return HttpRequest.put(
    {
      url: WebsiteInfoApi.AddShippingCompanyZone + '/' + id,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 删除船司专区数据
 * @param id 船司专区id
 * @returns 结果
 */
export const deleteShippingCompanyZone = (id: string) => {
  return HttpRequest.delete(
    {
      url: WebsiteInfoApi.AddShippingCompanyZone + '/' + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 查询船司百科数据
 * @param id 船司专区id
 * @returns 船司专区列表
 */
export const getShipownerEncyclopedia = (id: string) => {
  return HttpRequest.get(
    {
      url: WebsiteInfoApi.ShipownerEncyclopedia + id + '/wiki',
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 修改船司百科数据
 * @param params 船司专区参数
 * @returns 结果
 */
export const updateShipownerEncyclopedia = (
  params: ShipownerEncyclopediaType,
  id: string,
) => {
  return HttpRequest.put(
    {
      url: WebsiteInfoApi.ShipownerEncyclopedia + id + '/wiki',
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};
