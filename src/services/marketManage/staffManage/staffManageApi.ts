import { HttpRequest } from '@/utils/request';
import type {
  StaffJoinAffiliateType,
  StaffManageParams,
  StaffManageType,
} from './staffManageModel';

/**
 * 枚举用户管理相关的api
 */
export enum StaffApi {
  StaffManage = '/staff/customer',
  StaffManageByPage = '/staff/customer/page',
  StaffSearchSupplier = '/staff/customer/affiliate/supplier/',
  StaffJoinAffiliate = '/staff/customer/affiliate/join',
  StaffComboPermissionRecord = '/staff/customer/query/log',
  StaffSearchStatistic = '/staff/customer/affiliate/search',
  StaffLevelRecord = '/staff/customer/query/log',
  StaffExtraEquityLimit = '/staff/customer/extra/query/rights',
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
    sort: JSON.stringify(params.sort),
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
 * 获取用户详情数据
 * @param id 客户参数
 * @returns 客户列表
 */
export const getStaffManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: StaffApi.StaffManage + '/' + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增用户
 * @param params 用户参数
 * @returns 用户列表
 */
export const addStaffManage = (params: StaffManageType) => {
  return HttpRequest.post(
    {
      url: StaffApi.StaffManage,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 修改用户
 * @param params 用户参数
 * @returns 用户列表
 */
export const updateStaffManage = (params: StaffManageType, id: string) => {
  return HttpRequest.put(
    {
      url: StaffApi.StaffManage + '/' + id,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 删除用户
 * @param params 用户参数
 * @returns 用户列表
 */
export const deleteStaffManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: StaffApi.StaffManage + '/' + id,
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
      url: StaffApi.StaffManage + '/' + id + '/affiliate',
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增用户跟进记录
 * @param params 用户参数
 * @returns 用户列表
 */
export const addStaffFollowRecord = (
  id: string,
  params: { content: string }
) => {
  return HttpRequest.post(
    {
      url: StaffApi.StaffManage + '/' + id + '/follow',
      params: params,
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
 * 获取用户等级变更记录
 * @param id 客户参数
 * @returns 客户列表
 */
export const getStaffLevelRecord = (params: {
  filter: {
    customerId: string;
  };
}) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: StaffApi.StaffLevelRecord,
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

/**
 * 登陆后台用户账号(工作台)
 * @param id 客户参数
 * @returns 客户列表
 */
export const postStaffSearchStatistic = (id: string) => {
  return HttpRequest.post(
    {
      url: StaffApi.StaffManage + '/' + id + '/login',
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 获取用户额外套餐权限
 * @param id 客户参数
 * @returns 客户列表
 */
export const getStaffExtraEquityLimit = (params: { customerId: string }) => {
  return HttpRequest.get(
    {
      url: StaffApi.StaffExtraEquityLimit,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};
