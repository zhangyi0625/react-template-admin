import { HttpRequest } from '@/utils/request';
import type {
  StaffManageSearchParams,
  StaffManageType,
} from './staffManageModel';

/**
 * 枚举企业用户管理相关的api
 */
export enum StaffManageApi {
  staffManage = '/business/customer',
  staffManageByPage = '/business/customer/page',
}

/**
 * 分页获取企业用户管理列表
 * @param params 企业用户管理参数
 * @returns 企业用户管理列表
 */
export const getStaffManageListByPage = (params: StaffManageSearchParams) => {
  return HttpRequest.get<StaffManageType[]>(
    {
      url: StaffManageApi.staffManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 获取企业用户管理列表
 * @param params 企业用户管理参数
 * @returns 企业用户管理列表
 */
export const getStaffManageList = (
  params: Partial<StaffManageSearchParams>,
) => {
  return HttpRequest.get<StaffManageType[]>(
    {
      url: StaffManageApi.staffManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 获取企业用户管理详情
 * @param params 企业用户管理详情参数
 * @returns 企业用户管理详情
 */
export const getStaffManageDetail = (id: string) => {
  return HttpRequest.get<StaffManageType>(
    {
      url: StaffManageApi.staffManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 创建企业用户管理
 * @param params 企业用户管理参数
 * @returns 企业用户管理详情
 */
export const createStaffManage = (params: StaffManageType) => {
  return HttpRequest.post(
    {
      url: StaffManageApi.staffManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 更新企业用户管理
 * @param params 企业用户管理参数
 * @returns 企业用户管理详情
 */
export const updateStaffManage = (params: StaffManageType) => {
  return HttpRequest.put(
    {
      url: StaffManageApi.staffManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 删除企业用户管理
 * @param params 企业用户管理删除参数
 * @returns 企业用户管理详情
 */
export const deleteStaffManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: StaffManageApi.staffManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};
