import { HttpRequest } from '@/utils/request';
import type { CabinManageSearchParams } from './cabinManageModel';

/**
 * 枚举舱位管理相关的api
 */
export enum CabinManageApi {
  CabinManage = '/staff/product/v2',
  CabinManageByPage = '/staff/product/page/v2',
  CabinManageServiceFee = '/staff/service-fee',
  CabinManageDelete = '/staff/product/batch/delist',
  CabinManageFile = '/staff/invoice/approval/file/',
  CabinManageUploadFile = '/staff/invoice/approval/upload/',
}

/**
 * @description 分页获取舱位管理列表
 * @param params 舱位管理参数
 * @returns 舱位管理列表
 */
export const getCabinManageListByPage = (params: CabinManageSearchParams) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
    sort: JSON.stringify(params.sort),
  };
  return HttpRequest.get(
    {
      url: CabinManageApi.CabinManageByPage,
      params: qsParams,
      timeout: 30000,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取舱位管理详情
 * @param id 舱位管理参数
 * @param params 舱位管理参数
 * @returns 舱位管理详情
 */
export const getCabinManageDetail = (id: string, params: { type: string }) => {
  return HttpRequest.get(
    {
      url: CabinManageApi.CabinManage + '/' + id,
      params: params,
      timeout: 30000,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取舱位管理服务费用详情
 * @param params 舱位管理参数
 * @returns 舱位管理列表
 */
export const getCabinManageServiceFee = (params: { service: 'BOOKING' }) => {
  return HttpRequest.get(
    {
      url: CabinManageApi.CabinManageServiceFee,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 舱位管理 舱位下线
 * @param params 舱位管理参数
 * @returns 结果
 */
export const deleteCabinManage = (params: string[]) => {
  return HttpRequest.post(
    {
      url: CabinManageApi.CabinManageDelete,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取舱位管理
 * @param id 舱位管理参数
 * @returns 舱位管理列表
 */
export const getCabinManageFile = (id: string) => {
  return HttpRequest.get(
    {
      url: CabinManageApi.CabinManageFile + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 舱位管理
 * @param params 舱位管理参数
 * @returns 结果
 */
export const postCabinManageUploadFile = (params: FormData, id: string) => {
  return HttpRequest.post<Response>(
    {
      url: CabinManageApi.CabinManageUploadFile + id,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 舱位管理
 * @param id 舱位管理参数
 * @returns 结果
 */
export const deleteCabinManageFile = (id: string) => {
  return HttpRequest.delete(
    {
      url: CabinManageApi.CabinManageFile + id,
    },
    {
      isTransformResponse: false,
    },
  );
};
