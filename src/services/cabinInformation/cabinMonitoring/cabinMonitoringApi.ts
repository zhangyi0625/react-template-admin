import { HttpRequest } from '@/utils/request';
import type {
  CabinMonitoringExtraParams,
  CabinMonitoringSearchParams,
} from './cabinMonitoringModel';

/**
 * 枚举舱位监控相关的api
 */
export enum CabinMonitoringApi {
  CabinMonitoring = '/staff/product/group/',
  CabinMonitoringByPage = '/staff/seatCatcher/page',
  CabinMonitoringExtra = 'staff/seatCatcher/getExtra',
  CabinMonitoringExtraSave = '/staff/seatCatcher/saveExtra',
}

/**
 * @description 分页获取舱位监控列表
 * @param params 舱位监控参数
 * @returns 舱位监控列表
 */
export const getCabinMonitoringListByPage = (
  params: CabinMonitoringSearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: CabinMonitoringApi.CabinMonitoringByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取舱位监控详情
 * @param id 舱位监控参数
 * @returns 舱位监控详情
 */
export const getCabinMonitoringDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: CabinMonitoringApi.CabinMonitoring + '/' + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 舱位监控 查询额外参数
 * @param params 舱位监控参数
 * @returns 舱位监控额外参数
 */
export const getCabinMonitoringExtra = (params: { carrierType: string }) => {
  return HttpRequest.get(
    {
      url: CabinMonitoringApi.CabinMonitoringExtra,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 舱位监控 修改额外参数
 * @param params 舱位监控参数
 * @returns 结果
 */
export const putCabinMonitoringExtra = (params: CabinMonitoringExtraParams) => {
  return HttpRequest.post(
    {
      url: CabinMonitoringApi.CabinMonitoringExtraSave,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 舱位监控 删除船司航线
 * @param id 舱位监控参数
 * @returns 结果
 */
export const deleteCabinMonitoring = (id: string) => {
  return HttpRequest.delete(
    {
      url: CabinMonitoringApi.CabinMonitoring + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 舱位监控 更新船司航线
 * @param id 舱位监控参数
 * @returns 结果
 */
export const updateShippingCabinMonitoring = (id: string) => {
  return HttpRequest.post(
    {
      url: CabinMonitoringApi.CabinMonitoring + id + '/updating',
    },
    {
      isTransformResponse: false,
    },
  );
};
