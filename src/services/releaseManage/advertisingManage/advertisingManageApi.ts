import { HttpRequest } from '@/utils/request';
import type {
  AdvertisingManageSearchParams,
  AdvertisingManageType,
} from './advertisingManageModel';

/**
 * 枚举广告管理相关的api
 */
export enum AdvertisingManageApi {
  AdvertisingManage = '/business/advertisement',
  AdvertisingManageByPage = '/business/advertisement/page',
}

/**
 * 分页获取广告管理列表
 * @param params 广告管理参数
 * @returns 广告管理列表
 */
export const getAdvertisingManageListByPage = (
  params: AdvertisingManageSearchParams,
) => {
  return HttpRequest.get<AdvertisingManageType[]>(
    {
      url: AdvertisingManageApi.AdvertisingManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 获取广告管理列表
 * @param params 广告管理参数
 * @returns 广告管理列表
 */
export const getAdvertisingManageList = (
  params: Partial<AdvertisingManageSearchParams>,
) => {
  return HttpRequest.get<AdvertisingManageType[]>(
    {
      url: AdvertisingManageApi.AdvertisingManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 获取广告管理详情
 * @param params 广告管理详情参数
 * @returns 广告管理详情
 */
export const getAdvertisingManageDetail = (id: string) => {
  return HttpRequest.get<AdvertisingManageType>(
    {
      url: AdvertisingManageApi.AdvertisingManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 创建广告管理
 * @param params 广告管理参数
 * @returns 广告管理详情
 */
export const createAdvertisingManage = (params: AdvertisingManageType) => {
  return HttpRequest.post(
    {
      url: AdvertisingManageApi.AdvertisingManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 更新广告管理
 * @param params 广告管理参数
 * @returns 广告管理详情
 */
export const updateAdvertisingManage = (params: AdvertisingManageType) => {
  return HttpRequest.put(
    {
      url: AdvertisingManageApi.AdvertisingManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 删除广告管理
 * @param params 广告管理删除参数
 * @returns 广告管理详情
 */
export const deleteAdvertisingManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: AdvertisingManageApi.AdvertisingManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};
