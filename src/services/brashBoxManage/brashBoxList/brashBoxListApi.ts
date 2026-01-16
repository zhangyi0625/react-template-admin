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
}

/**
 * 获取刷箱记录列表
 * @param params 订舱管理参数
 * @returns 刷箱记录列表
 */
export const getBrashBoxManagePage = (params: BrashBoxListSearchParams) => {
  return HttpRequest.get(
    {
      url: BrashBoxManageApi.BrashBoxList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
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
    }
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
    }
  );
};

/**
 * 新增刷箱任务
 * @param params 刷箱管理参数
 * @returns 结果
 */
export const addBrashBoxList = (params: BrashBoxListType) => {
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
export const editBrashBoxList = (params: BrashBoxListType) => {
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
    }
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
    }
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
    }
  );
};
