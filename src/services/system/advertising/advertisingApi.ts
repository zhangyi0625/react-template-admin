import { HttpRequest } from '@/utils/request';
import type {
  AdvertisingManageSearchParams,
  AdvertisingManageType,
} from './advertisingModel';
import { filterKeys } from '@/utils/tool';

/**
 * 枚举广告相关的api
 */
export enum AdvertisingManageApi {
  AdvertisingManage = '/system/advertising',
  AdvertisingManageByPage = '/system/advertising/page',
  batchAdvertisingManage = '/system/advertising/batch',
}

/**
 * 查询所有广告管理
 * @returns 广告管理
 */
export const getAdvertisingManage = () => {
  return HttpRequest.get(
    {
      url: AdvertisingManageApi.AdvertisingManage,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 分页查询公告管理
 * @param params 广告参数
 * @returns 广告管理
 */
export const getAdvertisingManageByPage = (
  params: AdvertisingManageSearchParams
) => {
  let qsParams = {
    ...filterKeys(params, ['filter'], false),
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: AdvertisingManageApi.AdvertisingManageByPage,
      params: qsParams,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 查询广告详细信息
 * @returns 公告管理
 */
export const getAdvertisingDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: AdvertisingManageApi.AdvertisingManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 新增广告
 * @param params 广告参数
 * @returns 结果
 */
export const addAdvertisingManage = (params: AdvertisingManageType) => {
  return HttpRequest.post({
    url: AdvertisingManageApi.AdvertisingManage,
    data: params,
  });
};

/**
 * 编辑广告信息
 * @param params 广告参数
 * @returns 结果
 */
export const editAdvertisingManage = (params: AdvertisingManageType) => {
  return HttpRequest.put({
    url: AdvertisingManageApi.AdvertisingManage,
    data: params,
  });
};

/**
 * 删除广告信息
 * @returns 公告管理
 */
export const deleteAdvertisingManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: AdvertisingManageApi.AdvertisingManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 批量删除广告信息
 * @returns 公告管理
 */
export const deleteBatchAdvertisingManage = (params: { ids: string[] }) => {
  return HttpRequest.post(
    {
      url: AdvertisingManageApi.AdvertisingManage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 批量删除广告信息
 * @returns 公告管理
 */
export const deletebatchAdvertisingManage = (ids: string[]) => {
  return HttpRequest.delete(
    {
      url: AdvertisingManageApi.batchAdvertisingManage,
      params: ids,
    },
    {
      successMessageMode: 'none',
    }
  );
};
