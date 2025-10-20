import { HttpRequest } from '@/utils/request'
import {
  AffilateAccountParams,
  ScheduleAccountParams,
  BatchLoginAccount,
} from './todayPlanModal'

/**
 * 枚举今日计划的api
 */
export enum TodayPlanApi {
  scheduleAccount = '/core/business/account-pre-login/booking/list',
  affilateAccount = '/core/business/account-pre-login/page',
  addTodayRecord = '/core/business/account-pre-login',
  loginAcconut = '/core/business/account-pre-login/start',
  batchLoginAccount = '/core/business/account-pre-login/batch/start',
}

/**
 * 分页查询按公司账号预登录列表
 * @returns 公司账号预登录列表
 */
export const getAffilateAccountList = (params: AffilateAccountParams) => {
  return HttpRequest.get(
    {
      url: TodayPlanApi.affilateAccount,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页查询按公司账号预登录列表
 * @returns 公司账号预登录列表
 */
export const getScheduleAccountList = (params: ScheduleAccountParams) => {
  return HttpRequest.get(
    {
      url: TodayPlanApi.scheduleAccount,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加今日预登录记录
 * @param params 添加今日预登录记录参数
 * @returns
 */
export const addTodayLoginRecord = (params: BatchLoginAccount) => {
  return HttpRequest.post(
    {
      url: TodayPlanApi.addTodayRecord,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 登录账号
 * @param params 登录账号参数
 * @returns
 */
export const addLoginAccount = (params: BatchLoginAccount) => {
  return HttpRequest.post(
    {
      url: TodayPlanApi.loginAcconut,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 批量登录账号
 * @param params 批量登录账号参数
 * @returns
 */
export const addBatchLogin = (params: BatchLoginAccount[]) => {
  return HttpRequest.post(
    {
      url: TodayPlanApi.batchLoginAccount,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
