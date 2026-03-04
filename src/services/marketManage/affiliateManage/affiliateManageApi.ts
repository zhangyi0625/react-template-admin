import { HttpRequest } from '@/utils/request';
import type {
  AffiliateManageType,
  AffiliateManageParams,
} from './affiliateManageModel';

/**
 * 枚举客户管理相关的api
 */
export enum AffiliateApi {
  AffiliateManage = '/staff/customer/affiliate',
  AffiliateManageByPage = '/staff/customer/affiliate/page',
  AffiliateSearchSupplier = '/staff/customer/affiliate/supplier/',
  AffiliateManageComboPermission = '/staff/customer/affiliate/extra/query/rights',
  // StaffManageEquity = '/staff/query/rights/base/list',
}

/**
 * @description 分页查询客户数据
 * @param params 客户参数
 * @returns 客户列表
 */
export const getAffiliateManageByPage = (params: AffiliateManageParams) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
    sort: JSON.stringify(params.sort),
  };
  return HttpRequest.get(
    {
      url: AffiliateApi.AffiliateManageByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取客户详情数据
 * @param id 客户参数
 * @returns 客户列表
 */
export const getAffiliateManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: AffiliateApi.AffiliateManage + '/' + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 新增客户数据
 * @param params 客户参数
 * @returns 客户列表
 */
export const addAffiliateManage = (params: AffiliateManageType) => {
  return HttpRequest.post(
    {
      url: AffiliateApi.AffiliateManage,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 修改客户数据
 * @param params 客户参数
 * @returns 客户列表
 */
export const updateAffiliateManage = (
  params: AffiliateManageType,
  id: string,
) => {
  return HttpRequest.put(
    {
      url: AffiliateApi.AffiliateManage + '/' + id,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 删除客户数据
 * @param id 客户参数
 * @returns 客户列表
 */
export const deleteAffiliateManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: AffiliateApi.AffiliateManage + '/' + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 修改供应商查询权限
 * @param params 客户参数
 * @returns 客户列表
 */
export const updateAffiliateSearchSupplier = (
  params: { show: boolean },
  id: string,
) => {
  return HttpRequest.put(
    {
      url: AffiliateApi.AffiliateSearchSupplier + id,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取客户额外套餐权限数据
 * @param id 客户参数
 * @returns 客户列表
 */
export const getAffiliateManageComboPermission = (params: {
  affiliateId: string;
}) => {
  return HttpRequest.get(
    {
      url: AffiliateApi.AffiliateManageComboPermission,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};
