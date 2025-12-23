import { HttpRequest } from '@/utils/request';
import type {
  CouponManageEditType,
  CouponManageSearchParams,
  CouponProvideType,
} from './couponManageModel';

/**
 * 枚举优惠券管理相关的api
 */
export enum CouponManageApi {
  CouponManage = '/staff/coupon/',
  CouponManageByList = '/staff/coupon/page',
  CouponManageUseDetail = '/staff/coupon/used/list',
}

/**
 * 查询优惠券管理数据
 * @returns 优惠券管理列表
 */
export const getCouponManageByList = (params: CouponManageSearchParams) => {
  return HttpRequest.get(
    {
      url: CouponManageApi.CouponManageByList,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 查询优惠券管理详情
 * @returns 优惠券管理列表
 */
export const getCouponManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: CouponManageApi.CouponManage + id + '/customer',
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 制定优惠券发放
 * @param params 优惠券发放参数
 * @returns 优惠券管理列表
 */
export const putCouponProvider = (params: CouponProvideType, id: string) => {
  return HttpRequest.put(
    {
      url: CouponManageApi.CouponManage + id + '/customer',
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 查询优惠券管理具体使用情况
 * @param params 查询参数
 * @returns 优惠券管理列表
 */
export const getCouponManageUseDetail = (params: {
  created: string;
  customerId: string;
}) => {
  return HttpRequest.get(
    {
      url: CouponManageApi.CouponManageUseDetail,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增优惠券管理
 * @param params 优惠券管理参数
 * @returns 优惠券管理列表
 */
export const addCouponManage = (params: CouponManageEditType) => {
  return HttpRequest.post(
    {
      url: CouponManageApi.CouponManage,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 修改优惠券管理
 * @param params 优惠券管理参数
 * @returns 优惠券管理列表
 */
export const updateCouponManage = (
  params: CouponManageEditType,
  id: string
) => {
  return HttpRequest.put(
    {
      url: CouponManageApi.CouponManage + id,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 删除优惠券管理
 * @returns 优惠券管理列表
 */
export const deleteCouponManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: CouponManageApi.CouponManage + id,
    },
    {
      isTransformResponse: false,
    }
  );
};
