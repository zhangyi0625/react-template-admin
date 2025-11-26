import { HttpRequest } from '@/utils/request';
import type { ComprehensiveStatisticsSearchParams } from './comprehensiveStatisticsModel';

/**
 * 枚举综合统计相关的api
 */
export enum ComprehensiveStatisticsApi {
  ComprehensiveStatisticsByPage = '/staff/rtfm/ca1d/page',
}

/**
 * 分页获取综合统计列表
 * @param params 综合统计参数
 * @returns 综合统计列表
 */
export const getComprehensiveStatisticsListByPage = (
  params: ComprehensiveStatisticsSearchParams
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: ComprehensiveStatisticsApi.ComprehensiveStatisticsByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};
