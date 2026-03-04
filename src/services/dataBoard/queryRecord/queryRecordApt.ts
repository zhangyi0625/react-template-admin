import { HttpRequest } from '@/utils/request';
import type { QueryRecordSearchParams } from './queryRecordModel';

/**
 * 枚举查询记录相关的api
 */
export enum QueryRecordApi {
  QueryRecordByPage = '/staff/customer/query/record/page',
}

/**
 * @description 分页获取查询记录列表
 * @param params 查询记录参数
 * @returns 查询记录列表
 */
export const getQueryRecordListByPage = (params: QueryRecordSearchParams) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: QueryRecordApi.QueryRecordByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};
