import { HttpRequest } from '@/utils/request';
import type {
  ReleaseShippingHistoryMonitoringPortType,
  ReleaseShippingHistorySearchParams,
} from './releaseShippingHistoryModel';

/**
 * 枚举放舱历史相关的api
 */
export enum ReleaseShippingHistoryApi {
  ReleaseShippingHistoryByPage = '/staff/cabin/release/monitor/page',
  ReleaseShippingHistoryMonitoringPortByPage = 'staff/cabin/monitor/task/page',
  ReleaseShippingHistoryAddPort = 'staff/cabin/monitor/task/add',
  ReleaseShippingHistoryUpdatePort = 'staff/cabin/monitor/task/update',
  ReleaseShippingHistoryDeletePort = 'staff/cabin/monitor/task/delete',
}

/**
 * @description 分页获取放舱历史列表
 * @param params 放舱历史参数
 * @returns 放舱历史列表
 */
export const getReleaseShippingHistoryListByPage = (
  params: ReleaseShippingHistorySearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: ReleaseShippingHistoryApi.ReleaseShippingHistoryByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 分页获取放舱历史 监控港口列表
 * @param params 放舱历史参数
 * @returns 放舱历史列表
 */
export const getReleaseShippingHistoryMonitoringPortByPage = (
  params: ReleaseShippingHistorySearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: ReleaseShippingHistoryApi.ReleaseShippingHistoryMonitoringPortByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 放舱历史 添加监控港口
 * @param id 放舱历史参数
 * @returns 放舱历史列表
 */
export const postReleaseShippingHistoryAddPort = (
  params: ReleaseShippingHistoryMonitoringPortType,
) => {
  return HttpRequest.post(
    {
      url: ReleaseShippingHistoryApi.ReleaseShippingHistoryAddPort,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 放舱历史 修改监控港口
 * @param params 放舱历史参数
 * @returns 放舱历史列表
 */
export const putReleaseShippingHistoryAddPort = (
  params: ReleaseShippingHistoryMonitoringPortType,
) => {
  return HttpRequest.post(
    {
      url: ReleaseShippingHistoryApi.ReleaseShippingHistoryUpdatePort,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 放舱历史 删除监控港口
 * @param id 放舱历史参数
 * @returns 放舱历史列表
 */
export const deleteReleaseShippingHistoryDeletePort = (id: string) => {
  return HttpRequest.delete(
    {
      url:
        ReleaseShippingHistoryApi.ReleaseShippingHistoryDeletePort + '/' + id,
    },
    {
      isTransformResponse: false,
    },
  );
};
