import { HttpRequest } from '@/utils/request';
import { filterKeys } from '@/utils/tool';
import type {
  StaffManageSearchParams,
  StaffManageType,
} from './staffManageModel';

/**
 * 枚举员工相关的api
 */
export enum StaffManageApi {
  StaffManage = '/business/customer',
  StaffManageByPage = '/business/customer/page',
  batchStaffManage = '/business/customer/batch',
}

/**
 * 查询所有员工管理
 * @returns 员工管理
 */
export const getAdvertisingManage = () => {
  return HttpRequest.get(
    {
      url: StaffManageApi.StaffManage,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 分页查询公告管理
 * @param params 员工参数
 * @returns 员工管理
 */
export const getStaffManageByPage = (params: StaffManageSearchParams) => {
  let qsParams = {
    ...filterKeys(params, ['filter'], false),
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: StaffManageApi.StaffManageByPage,
      params: qsParams,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 查询员工详细信息
 * @returns 公告管理
 */
export const getAdvertisingDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: StaffManageApi.StaffManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 新增员工
 * @param params 员工参数
 * @returns 结果
 */
export const addStaffManage = (params: StaffManageType) => {
  return HttpRequest.post({
    url: StaffManageApi.StaffManage,
    data: params,
  });
};

/**
 * 编辑员工信息
 * @param params 员工参数
 * @returns 结果
 */
export const editStaffManage = (params: StaffManageType) => {
  return HttpRequest.put({
    url: StaffManageApi.StaffManage,
    data: params,
  });
};

/**
 * 删除员工信息
 * @returns 公告管理
 */
export const deleteStaffManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: StaffManageApi.StaffManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  );
};
