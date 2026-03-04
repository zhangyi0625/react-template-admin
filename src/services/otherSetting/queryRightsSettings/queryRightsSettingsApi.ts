import { HttpRequest } from '@/utils/request';
import type {
  EquityRightsBaseEditType,
  EquityRightsExtraEditType,
  EquityRightsExtraPriceUpdateType,
} from './queryRightsSettingsModel';

/**
 * 枚举权益管理相关的api
 */
export enum EquityApi {
  EquityRightsBase = '/staff/query/rights/base/list',
  EquityRightsExtra = '/staff/query/rights/extra/list',
  EquityRightsEdit = '/staff/customer/affiliate/extra/query/rights',
  EquityRightsExtraEdit = '/staff/customer/extra/query/rights',
  EquityRightsExtraPriceUpdate = '/staff/query/rights/extra/update',
}

/**
 * 查询基本权益数据
 * @returns 权益列表
 */
export const getEquityRightsBase = () => {
  return HttpRequest.get(
    {
      url: EquityApi.EquityRightsBase,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * 查询额外权益数据
 * @returns 权益列表
 */
export const getEquityRightsExtra = () => {
  return HttpRequest.get(
    {
      url: EquityApi.EquityRightsExtra,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * 修改基本权益数据
 * @param params 权益参数
 * @returns 权益列表
 */
export const postEquityRightsEdit = (params: EquityRightsBaseEditType) => {
  return HttpRequest.post(
    {
      url: EquityApi.EquityRightsEdit,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * 修改额外套餐数据
 * @param params 权益参数
 * @returns 权益列表
 */
export const postEquityRightsExtraEdit = (
  params: EquityRightsExtraEditType,
) => {
  return HttpRequest.post(
    {
      url: EquityApi.EquityRightsExtraEdit,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * 修改额外套餐费用
 * @param params 权益参数
 * @returns 权益列表
 */
export const postEquityRightsExtraPriceUpdate = (
  params: EquityRightsExtraPriceUpdateType,
) => {
  return HttpRequest.post(
    {
      url: EquityApi.EquityRightsExtraPriceUpdate,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};
