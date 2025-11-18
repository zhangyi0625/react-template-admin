import { HttpRequest } from '@/utils/request';
import type {
  ShippingAccountAuditType,
  ShippingAccountManageParams,
} from './shippingAccountModel';

/**
 * 枚举船司账号管理相关的api
 */
export enum ShippingAccountApi {
  ShippingAccountManage = '/staff/carrier/account',
  ShippingAccountManageByPage = '/staff/carrier/account/page',
  ShippingAccountAudit = '/staff/carrier/account/audit',
}

/**
 * 分页查询船司账号数据
 * @param params 船司账号参数
 * @returns 船司账号列表
 */
export const getShippingAccountManageByPage = (
  params: ShippingAccountManageParams
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: ShippingAccountApi.ShippingAccountManageByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 开启船司账号
 * @param id 船司账号参数
 * @returns 船司账号列表
 */
export const getShippingAccountDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: ShippingAccountApi.ShippingAccountManage + '/' + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 审核船司账号
 * @param id 船司账号参数
 * @returns 船司账号列表
 */
export const auditShippingAccount = (params: ShippingAccountAuditType) => {
  return HttpRequest.post(
    {
      url: ShippingAccountApi.ShippingAccountAudit,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};
