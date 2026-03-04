import { HttpRequest } from '@/utils/request';
import type { DailyActiveUserRecordSearchParams } from './dailyActiveUserRecordModel';

/**
 * 枚举用户日活记录相关的api
 */
export enum DailyActiveUserRecordApi {
  DailyActiveUserRecordByPage = '/staff/customer/daily-active/page',
}

/**
 * @description 分页获取用户日活记录列表
 * @param params 用户日活记录参数
 * @returns 用户日活记录列表
 */
export const getDailyActiveUserRecordListByPage = (
  params: DailyActiveUserRecordSearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: DailyActiveUserRecordApi.DailyActiveUserRecordByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};
