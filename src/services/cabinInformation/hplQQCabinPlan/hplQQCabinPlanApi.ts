import { HttpRequest } from '@/utils/request';
import type {
  HplQQCabinPlanSearchParams,
  HplQQCabinPlanShippingScheduleSearchParams,
} from './hplQQCabinPlanModel';

/**
 * 枚举HPLQQ订舱任务相关的api
 */
export enum HplQQCabinPlanApi {
  HplQQCabinPlanByPage = '/staff/hplQq/task/page',
  HplQQCabinPlanShippingSchedule = 'staff/hplQq/task/schedule/',
  HplQQCabinPlanShippingUpdateSchedule = 'staff/hplQq/task/update/carrier/schedule',
  HplQQCabinPlanShippingScheduleByPage = '/staff/carrier/product/plan/page',
  HplQQCabinPlanUpdate = '/staff/hplQq/task/mode/',
  HplQQCabinPlanCancel = 'staff/hplQq/task/cancel/',
  HplQQCabinPlanResult = 'staff/hplQq/task/order/',
}

/**
 * @description 分页获取HPLQQ订舱任务列表
 * @param params HPLQQ订舱任务参数
 * @returns HPLQQ订舱任务列表
 */
export const getHplQQCabinPlanListByPage = (
  params: HplQQCabinPlanSearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: HplQQCabinPlanApi.HplQQCabinPlanByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 分页获取HPLQQ订舱 船期列表
 * @param params HPLQQ订舱任务参数
 * @returns HPLQQ订舱任务列表
 */
export const getHplQQCabinPlanShippingScheduleByPage = (
  params: HplQQCabinPlanShippingScheduleSearchParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: HplQQCabinPlanApi.HplQQCabinPlanShippingScheduleByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description HPLQQ订舱任务 查询船期
 * @param id HPLQQ订舱任务参数
 * @returns HPLQQ订舱任务列表
 */
export const getHplQQCabinPlanShippingSchedule = (id: string) => {
  return HttpRequest.get(
    {
      url:
        HplQQCabinPlanApi.HplQQCabinPlanShippingSchedule + id + '?scheduleIds',
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description HPLQQ订舱任务 查询船期
 * @param params HPLQQ订舱任务参数
 * @returns HPLQQ订舱任务列表
 */
export const postHplQQCabinPlanShippingSchedule = (
  params: HplQQCabinPlanShippingScheduleSearchParams['filter'],
) => {
  return HttpRequest.post(
    {
      url: HplQQCabinPlanApi.HplQQCabinPlanShippingUpdateSchedule,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description HPLQQ订舱任务 更新任务
 * @param params HPLQQ订舱任务参数
 * @returns HPLQQ订舱任务列表
 */
export const putHplQQCabinPlanUpdate = (
  params: { vesselIds: string[]; type: 'VESSEL' },
  id: string,
) => {
  return HttpRequest.put(
    {
      url: HplQQCabinPlanApi.HplQQCabinPlanUpdate + id,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description HPLQQ订舱任务 取消任务
 * @param id HPLQQ订舱任务参数
 * @returns HPLQQ订舱任务列表
 */
export const deleteHplQQCabinPlan = (id: string) => {
  return HttpRequest.delete(
    {
      url: HplQQCabinPlanApi.HplQQCabinPlanCancel + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description HPLQQ订舱任务 订舱结果
 * @param id HPLQQ订舱任务参数
 * @returns HPLQQ订舱任务列表
 */
export const getHplQQCabinPlanResult = (id: string) => {
  return HttpRequest.get(
    {
      url: HplQQCabinPlanApi.HplQQCabinPlanResult + id,
    },
    {
      isTransformResponse: false,
    },
  );
};
