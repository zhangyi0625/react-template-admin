import { HttpRequest } from '@/utils/request';
import { BrashBoxSearchParams } from './brashBoxListModel';

export enum BrashBoxManageApi {
  BrashBoxManagePage = '/brashbox/page',
  BrashBoxAccountPage = '/brashbox/accout/page',
}

/**
 * 分页获取订舱管理列表
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const getBrashBoxManagePage = (params: BrashBoxSearchParams) => {
  return HttpRequest.get(
    {
      url: BrashBoxManageApi.BrashBoxManagePage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  );
};

export const getBrashBoxAccountPage = (params: BrashBoxSearchParams) => {
  return HttpRequest.get(
    {
      url: BrashBoxManageApi.BrashBoxAccountPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  );
};
