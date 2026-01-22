import { HttpRequest } from '@/utils/request';
import type {
  BoxPileManageSearchParams,
  BoxPileManageType,
} from './boxPileManageModel';

export enum BoxPileManageApi {
  BoxPileAccount = '/business/container-type',
  BoxPileAccountPage = '/business/container-type/page',
}

/**
 * 获取箱型管理列表
 * @param params 箱型管理参数
 * @returns 箱型管理列表
 */
export const getBoxPileManage = (params?: BoxPileManageSearchParams) => {
  return HttpRequest.get(
    {
      url: BoxPileManageApi.BoxPileAccount,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 分页获取箱型管理列表
 * @param params 箱型管理参数
 * @returns 箱型管理列表
 */
export const getBoxPileManagePage = (params: BoxPileManageSearchParams) => {
  return HttpRequest.get(
    {
      url: BoxPileManageApi.BoxPileAccountPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 新增箱型管理
 * @param params 箱型管理参数
 * @returns 结果
 */
export const addBoxPileManage = (params: BoxPileManageType) => {
  return HttpRequest.post({
    url: BoxPileManageApi.BoxPileAccount,
    data: params,
  });
};

/**
 * 编辑箱型管理
 * @param params 箱型管理参数
 * @returns 结果
 */
export const editBoxPileManage = (params: BoxPileManageType) => {
  return HttpRequest.put({
    url: BoxPileManageApi.BoxPileAccount,
    data: params,
  });
};

/**
 * 删除箱型管理
 * @param id 箱型管理id
 * @param params 箱型管理参数
 * @returns 结果
 */
export const deleteBoxPileManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: BoxPileManageApi.BoxPileAccount + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};
