import { HttpRequest } from '@/utils/request';
import type {
  AuthenticationAuditRejectType,
  AuthenticationManageParams,
} from './authenticationManageModel';

/**
 * 枚举认证管理相关的api
 */
export enum AffiliateApi {
  AuthenticationCertificationManage = '/staff/customer/affiliate/certification/page',
  AuthenticationSupplierManage = '/staff/supplier/page',
  AuthenticationCertificationByPass = '/api/staff/supplier/consent/',
  AuthenticationCertificationByReject = '/staff/customer/affiliate/certification/verify',
  AuthenticationManageDetail = '/staff/supplier//change/info/',
}

/**
 * @description 分页查询认证数据
 * @param params 认证参数
 * @returns 认证列表
 */
export const getAuthenticationManageByPage = (
  params: AuthenticationManageParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: AffiliateApi.AuthenticationCertificationManage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 分页查询企业信息审核数据
 * @param params 认证参数
 * @returns 认证列表
 */
export const getAuthenticationSupplierManageByPage = (
  params: AuthenticationManageParams,
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: AffiliateApi.AuthenticationSupplierManage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 查询企业信息审核详情数据
 * @param params 认证参数
 * @returns 认证列表
 */
export const getAuthenticationManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: AffiliateApi.AuthenticationManageDetail + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 通过企业信息审核数据
 * @param id 认证参数
 * @returns 认证列表
 */
export const postAuthenticationCertificationByPass = (id: string) => {
  return HttpRequest.post(
    {
      url: AffiliateApi.AuthenticationCertificationByPass + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 拒绝企业信息审核数据
 * @param params 认证参数
 * @returns 认证列表
 */
export const postAuthenticationCertificationByReject = (
  params: AuthenticationAuditRejectType,
) => {
  return HttpRequest.post(
    {
      url: AffiliateApi.AuthenticationCertificationByReject,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};
