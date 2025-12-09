import { HttpRequest } from '@/utils/request';
import type {
  RouteManageByCarrierRouteType,
  RouteManageSearchParams,
} from './routeManageModel';

/**
 * 枚举航线管理相关的api
 */
export enum RouteManageApi {
  RouteManage = '/staff/product/group/',
  RouteManageByPage = '/staff/product/group/page',
  BatchAddRouteManage = 'staff/product/group/batch',
}

/**
 * 分页获取航线管理列表
 * @param params 航线管理参数
 * @returns 航线管理列表
 */
export const getRouteManageListByPage = (params: RouteManageSearchParams) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
    sort: JSON.stringify(params.sort),
  };
  return HttpRequest.get(
    {
      url: RouteManageApi.RouteManageByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 获取航线管理详情
 * @param id 航线管理参数
 * @returns 航线管理列表
 */
export const getRouteManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: RouteManageApi.RouteManage + '/' + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 航线管理 批量添加船司航线
 * @param id 航线管理参数
 * @returns 航线管理列表
 */
export const postBatchAddRouteManage = (
  params: RouteManageByCarrierRouteType
) => {
  return HttpRequest.post(
    {
      url: RouteManageApi.BatchAddRouteManage,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 航线管理 修改船司航线
 * @param params 航线管理参数
 * @returns 航线管理列表
 */
export const putRouteManage = (
  params: RouteManageByCarrierRouteType,
  id: string
) => {
  return HttpRequest.post(
    {
      url: RouteManageApi.RouteManage + id,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 航线管理 删除船司航线
 * @param id 航线管理参数
 * @returns 航线管理列表
 */
export const deleteRouteManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: RouteManageApi.RouteManage + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 航线管理 更新船司航线
 * @param id 航线管理参数
 * @returns 航线管理列表
 */
export const updateShippingRouteManage = (id: string) => {
  return HttpRequest.post(
    {
      url: RouteManageApi.RouteManage + id + '/updating',
    },
    {
      isTransformResponse: false,
    }
  );
};
