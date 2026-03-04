import { HttpRequest } from '@/utils/request';
import type { CabinQueryRecordSearchParams } from './cabinQueryRecordModel';

/**
 * 枚举现舱查询记录相关的api
 */
export enum CabinQueryRecordApi {
  CabinQueryRecordByPage = '/staff/product/search/page',
}

/**
 * @description 分页获取现舱查询记录列表
 * @param params 现舱查询记录参数
 * @returns 现舱查询记录列表
 */
export const getCabinQueryRecordListByPage = (
  params: CabinQueryRecordSearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: CabinQueryRecordApi.CabinQueryRecordByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};
