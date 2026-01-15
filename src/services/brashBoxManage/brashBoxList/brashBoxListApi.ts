import { HttpRequest } from '@/utils/request';
import type {
  BrashBoxListSearchParams,
  BrashBoxListType,
} from './brashBoxListModel';

export enum BrashBoxManageApi {
  BrashBoxList = '/business/container-task',
  BrashBoxListPage = '/business/container-task/page',
}

/**
 * 获取刷箱账号列表
 * @param params 订舱管理参数
 * @returns 刷箱账号列表
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
 * 分页获取刷箱账号列表
 * @param params 订舱管理参数
 * @returns 刷箱账号列表
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
 * 新增刷箱账号
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
 * 编辑刷箱账号
 * @param params 广告参数
 * @returns 结果
 */
export const editBrashBoxList = (params: BrashBoxListType) => {
  return HttpRequest.put({
    url: BrashBoxManageApi.BrashBoxList,
    data: params,
  });
};

/**
 * 删除刷箱账号
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
