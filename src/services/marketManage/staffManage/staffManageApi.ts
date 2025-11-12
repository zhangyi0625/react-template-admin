import { HttpRequest } from '@/utils/request';
import type {
  StaffJoinAffiliateType,
  StaffManageParams,
} from './staffManageModel';

/**
 * 枚举用户管理相关的api
 */
export enum StaffApi {
  StaffManage = '/staff/customer/affiliate',
  StaffManageByPage = '/staff/customer/page',
  StaffSearchSupplier = '/staff/customer/affiliate/supplier/',
  StaffJoinAffiliate = '/staff/customer/affiliate/join',
  StaffManageDelete = '/staff/customer/',
  StaffComboPermissionRecord = '/staff/customer/query/log',
  StaffSearchStatistic = '/staff/customer/affiliate/search',
}

/**
 * 分页查询用户数据
 * @param params 用户参数
 * @returns 用户列表
 */
export const getStaffManageByPage = (params: StaffManageParams) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
    // sort: JSON.stringify(params.sort),
  };
  return HttpRequest.get(
    {
      url: StaffApi.StaffManageByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增用户加入企业
 * @param params 用户参数
 * @returns 用户列表
 */
export const addStaffJoinAffiliate = (params: StaffJoinAffiliateType) => {
  return HttpRequest.post(
    {
      url: StaffApi.StaffJoinAffiliate,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 删除企业用户
 * @param params 用户参数
 * @returns 用户列表
 */
export const deleteStaffInAffiliate = (id: string) => {
  return HttpRequest.post(
    {
      url: StaffApi.StaffManageDelete + id + '/affiliate',
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 获取套餐外权限变更记录
 * @param id 客户参数
 * @returns 客户列表
 */
export const getStaffComboPermissionRecord = (params: {
  filter: {
    affiliateId: string;
    module: string;
  };
}) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: StaffApi.StaffComboPermissionRecord,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 获取用户查询记录
 * @param id 客户参数
 * @returns 客户列表
 */
export const getStaffSearchStatistic = (params: {
  type: 'WEEk' | 'MONTH';
  affiliateId: string;
}) => {
  return HttpRequest.get(
    {
      url: StaffApi.StaffSearchStatistic + '/' + params.affiliateId,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};
