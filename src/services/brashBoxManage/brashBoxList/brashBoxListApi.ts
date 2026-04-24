import { HttpRequest } from '@/utils/request';
import type {
  BrashBoxListSearchParams,
  BrashBoxListType,
} from './brashBoxListModel';

export enum BrashBoxManageApi {
  BrashBoxList = '/business/container-task',
  BrashBoxListPage = '/business/container-task/page',
  BrashBoxListStart = '/business/container-task/start/',
  BrashBoxListStop = '/business/container-task/pause/',
  BrashBoxListCancel = '/business/container-task/cancel/',
  MyBrashBoxListPage = '/business/container-task/rel/page',
  MyBrashBoxListCancelPage = '/business/container-task-cancel/page',
  getByBillNo = '/business/container-task/getByBillNo/',
  RefreshResult = '/business/container-task/refresh/reuslt/',
}

/**
 * 获取刷箱记录列表
 * @param params 订舱管理参数
 * @returns 刷箱记录列表
 */
export const getBrashBoxList = (params?: BrashBoxListSearchParams) => {
  return HttpRequest.get(
    {
      url: BrashBoxManageApi.BrashBoxList,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 分页获取刷箱记录列表
 * @param params 订舱管理参数
 * @returns 刷箱记录列表
 */
export const getBrashBoxListPage = (params: BrashBoxListSearchParams) => {
  return HttpRequest.get(
    {
      url: BrashBoxManageApi.BrashBoxListPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 分页获取我的取消刷箱记录列表
 * @param params 订舱管理参数
 * @returns 刷箱记录列表
 */
export const getMyBrashBoxListCancelPage = (
  params: BrashBoxListSearchParams,
) => {
  return HttpRequest.get(
    {
      url: BrashBoxManageApi.MyBrashBoxListCancelPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 分页获取我的刷箱记录列表
 * @param params 订舱管理参数
 * @returns 刷箱记录列表
 */
export const getMyBrashBoxListPage = (params: BrashBoxListSearchParams) => {
  return HttpRequest.get(
    {
      url: BrashBoxManageApi.MyBrashBoxListPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 获取刷箱记录详情
 * @param id 刷箱记录id
 * @returns 刷箱记录详情
 */
export const getBrashBoxManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: BrashBoxManageApi.BrashBoxList + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 新增刷箱任务
 * @param params 刷箱管理参数
 * @returns 结果
 */
export const addBrashBoxList = (
  params?: Pick<
    BrashBoxListType['task'],
    'billNo' | 'id' | 'ctnType' | 'ctnNumber'
  >,
) => {
  return HttpRequest.post({
    url: BrashBoxManageApi.BrashBoxList,
    data: params,
  });
};

/**
 * 编辑刷箱任务
 * @param params 刷箱管理参数
 * @returns 结果
 */
export const editBrashBoxList = (
  params?: Pick<
    BrashBoxListType['task'],
    'billNo' | 'id' | 'ctnType' | 'ctnNumber'
  >,
) => {
  return HttpRequest.put({
    url: BrashBoxManageApi.BrashBoxList,
    data: params,
  });
};

/**
 * 删除刷箱任务
 * @param id 刷箱任务id
 * @returns 结果
 */
export const deleteBrashBoxList = (id: string) => {
  return HttpRequest.delete(
    {
      url: BrashBoxManageApi.BrashBoxList + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 取消刷箱任务
 * @param id 刷箱任务id
 * @returns 结果
 */
export const cancelBrashBoxList = (id: string, remark: string) => {
  return HttpRequest.post(
    {
      url: BrashBoxManageApi.BrashBoxListCancel + id + '?remark=' + remark,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 启动刷箱任务
 * @param id 刷箱任务id
 * @returns 结果
 */
export const postBrashBoxStart = (id: string) => {
  return HttpRequest.post(
    {
      url: BrashBoxManageApi.BrashBoxListStart + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 启动刷箱任务
 * @param id 刷箱任务id
 * @returns 结果
 */
export const postRefreshResult = (id: string) => {
  return HttpRequest.get(
    {
      url: BrashBoxManageApi.RefreshResult + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 停止刷箱任务
 * @param id 刷箱任务id
 * @returns 结果
 */
export const postBrashBoxStop = (id: string) => {
  return HttpRequest.post(
    {
      url: BrashBoxManageApi.BrashBoxListStop + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 根据提单号获取刷箱任务
 * @param billNo 提单号
 * @returns 刷箱任务
 */

export const getBrashBoxListByBillNo = (billNo: string) => {
  return HttpRequest.get(
    {
      url: BrashBoxManageApi.getByBillNo + billNo,
    },
    {
      successMessageMode: 'none',
    },
  );
};
