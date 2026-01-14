import { HttpRequest } from '@/utils/request';
import type {
  BrashBoxAccountSearchParams,
  BrashBoxAccountType,
} from './brashBoxAccountModel';

export enum BrashBoxManageApi {
  BrashBoxAccount = '/business/account',
  BrashBoxAccountPage = '/business/account/page',
}

/**
 * 获取刷箱账号列表
 * @param params 订舱管理参数
 * @returns 刷箱账号列表
 */
export const getBrashBoxManagePage = (params: BrashBoxAccountSearchParams) => {
  return HttpRequest.get(
    {
      url: BrashBoxManageApi.BrashBoxAccount,
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
export const getBrashBoxAccountPage = (params: BrashBoxAccountSearchParams) => {
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

/**
 * 新增刷箱账号
 * @param params 刷箱管理参数
 * @returns 结果
 */
export const addBrashBoxAccount = (params: BrashBoxAccountType) => {
  return HttpRequest.post({
    url: BrashBoxManageApi.BrashBoxAccount,
    data: params,
  });
};

/**
 * 编辑刷箱账号
 * @param params 广告参数
 * @returns 结果
 */
export const editBrashBoxAccount = (params: BrashBoxAccountType) => {
  return HttpRequest.put({
    url: BrashBoxManageApi.BrashBoxAccount,
    data: params,
  });
};

/**
 * 删除刷箱账号
 * @returns 结果
 */
export const deleteBrashBoxAccount = (id: string) => {
  return HttpRequest.delete(
    {
      url: BrashBoxManageApi.BrashBoxAccount + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  );
};
