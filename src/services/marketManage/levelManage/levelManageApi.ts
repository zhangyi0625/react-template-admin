import { HttpRequest } from '@/utils/request';
import type { LevelManageParams } from './levelManageModel';

/**
 * 枚举等级管理相关的api
 */
export enum LevelApi {
  LevelManageByPage = '/staff/customer/grade/log/page',
}

/**
 * 分页查询等级数据
 * @param params 等级参数
 * @returns 等级列表
 */
export const getLevelManageByPage = (params: LevelManageParams) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: LevelApi.LevelManageByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};
