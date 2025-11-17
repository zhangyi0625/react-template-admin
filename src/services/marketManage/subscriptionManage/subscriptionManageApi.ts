import { HttpRequest } from '@/utils/request';
import type { SubscriptionManageParams } from './subscriptionManageModel';

/**
 * 枚举订阅管理相关的api
 */
export enum SubscriptionApi {
  SubscriptionManage = '/staff/pricing/notify',
  SubscriptionManageByPage = '/staff/pricing/notify/page',
  SubscriptionEnable = '/staff/pricing/notify/enable/',
  SubscriptionSuspend = '/staff/pricing/notify/disable/',
}

/**
 * 分页查询订阅数据
 * @param params 订阅参数
 * @returns 订阅列表
 */
export const getSubscriptionManageByPage = (
  params: SubscriptionManageParams
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: SubscriptionApi.SubscriptionManageByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 开启订阅
 * @param id 订阅参数
 * @returns 订阅列表
 */
export const updateSubscriptionEnable = (id: string) => {
  return HttpRequest.put(
    {
      url: SubscriptionApi.SubscriptionEnable + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 暂停订阅
 * @param id 订阅参数
 * @returns 订阅列表
 */
export const updateSubscriptionSuspend = (id: string) => {
  return HttpRequest.put(
    {
      url: SubscriptionApi.SubscriptionSuspend + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 删除订阅
 * @param id 订阅参数
 * @returns 订阅列表
 */
export const deleteSubscription = (id: string) => {
  return HttpRequest.delete(
    {
      url: SubscriptionApi.SubscriptionManage + '/' + id,
    },
    {
      isTransformResponse: false,
    }
  );
};
