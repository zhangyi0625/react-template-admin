import { HttpRequest } from '@/utils/request';
import type {
  ShippingCompanyZoneParams,
  ShippingCompanyZoneType,
  UserFeedbackParams,
} from './wesiteInfoModel';

/**
 * 枚举官网信息管理相关的api
 */
export enum WebsiteInfoApi {
  UserFeedbackByPage = '/staff/feedback/page',
  ShippingCompanyZoneByPage = '/staff/carrier/page',
  AddShippingCompanyZone = '/staff/carrier',
}

/**
 * 分页查询用户反馈
 * @param params 用户反馈参数
 * @returns 用户反馈
 */
export const getUserFeedbackByPage = (params: UserFeedbackParams) => {
  return HttpRequest.get(
    {
      url: WebsiteInfoApi.UserFeedbackByPage,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 分页查询船司专区数据
 * @param params 船司专区参数
 * @returns 船司专区列表
 */
export const getShippingCompanyZoneByPage = (
  params: ShippingCompanyZoneParams
) => {
  return HttpRequest.get(
    {
      url: WebsiteInfoApi.ShippingCompanyZoneByPage,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增查询船司专区数据
 * @param params 船司专区参数
 * @returns 船司专区列表
 */
export const addShippingCompanyZone = (params: ShippingCompanyZoneType) => {
  return HttpRequest.post(
    {
      url: WebsiteInfoApi.AddShippingCompanyZone,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 修改查询船司专区数据
 * @param params 船司专区参数
 * @returns 船司专区列表
 */
export const updateShippingCompanyZone = (
  params: ShippingCompanyZoneType,
  id: string
) => {
  return HttpRequest.put(
    {
      url: WebsiteInfoApi.AddShippingCompanyZone + '/' + id,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 删除查询船司专区数据
 * @param id 船司专区参数
 * @returns 船司专区列表
 */
export const deleteShippingCompanyZone = (id: string) => {
  return HttpRequest.delete(
    {
      url: WebsiteInfoApi.AddShippingCompanyZone + '/' + id,
    },
    {
      isTransformResponse: false,
    }
  );
};
