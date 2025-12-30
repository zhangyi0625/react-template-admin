import { HttpRequest } from '@/utils/request';
import type { Response } from '@/types/global';
import type {
  CabinResultSearchParams,
  ImportCabinResultType,
  ManualPublicationType,
} from './cabinResultModel';

/**
 * 枚举怕舱结果需要的接口地址
 */
export enum CabinResultAPi {
  /**
   * 拍舱结果列表
   */
  CabinResultByPage = '/staff/fast/booking/page',
  /**
   * 导入拍舱结果
   */
  ImportCabinResult = '/staff/fast/booking/upload/excel/',
  /**
   * 批量发布舱位
   */
  BatchProduct = '/staff/fast/booking/publish/product',
  /**
   * 取消关联舱位
   */
  OnRelevance = '/staff/fast/booking/unbind',
  /**
   * 关联订舱结果
   */
  RelevanceResult = '/staff/fast/booking/bind',
  /**
   * 取消已关联订单
   */
  CancelRelevanceResult = '/staff/fast/booking/unbind',
  /**
   * 手动发布仓位
   */
  ManualPublication = '/staff/product/add',
}

/**
 * 查询拍舱结果
 * @param params
 * @returns
 */

export const getCabinResultByPage = (params: CabinResultSearchParams) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) };
  return HttpRequest.get<Response>(
    {
      url: CabinResultAPi.CabinResultByPage,
      params: qsParams,
    },
    { isTransformResponse: false }
  );
};

/**
 * 导入拍舱结果
 * @param data
 * @returns
 */

export const postCabinResult = (data: ImportCabinResultType) => {
  return HttpRequest.post<Response>(
    {
      url: CabinResultAPi.ImportCabinResult,
      data: data,
    },
    { isTransformResponse: false }
  );
};

/**
 * 批量发布舱位
 * @param data
 * @returns
 */

export const postBatchProduct = (data: string[]) => {
  return HttpRequest.post<Response>(
    {
      url: CabinResultAPi.BatchProduct,
      data: data,
    },
    { isTransformResponse: false }
  );
};

/**
 * 取消关联舱位
 * @param data
 * @returns
 */

export const postOnRelevance = (data: { ids: string[] }) => {
  return HttpRequest.post<Response>(
    {
      url: CabinResultAPi.OnRelevance,
      data: data,
    },
    { isTransformResponse: false }
  );
};

/**
 * 关联订舱结果
 * @param data
 * @returns
 */

export const postRelevanceResult = (data: {
  ids: string[];
  orderId: string;
}) => {
  return HttpRequest.post<Response>(
    {
      url: CabinResultAPi.RelevanceResult,
      data: data,
    },
    { isTransformResponse: false }
  );
};

/**
 * 取消已关联订舱结果
 * @param data
 * @returns
 */

export const postCancelRelevanceResult = (data: { ids: string[] }) => {
  return HttpRequest.post<Response>(
    {
      url: CabinResultAPi.CancelRelevanceResult,
      data: data,
    },
    { isTransformResponse: false }
  );
};

/**
 * 手动发布舱位
 * @param params
 * @returns
 */

export const postManualPublication = (params: ManualPublicationType) => {
  return HttpRequest.post<Response>(
    {
      url: CabinResultAPi.ManualPublication,
      data: params,
    },
    { isTransformResponse: false }
  );
};
