import { HttpRequest } from '@/utils/request';
import type {
  OpenInterfaceBusinessType,
  OpenInterfaceParams,
  OpenInterfaceType,
} from './openInterfaceModel';

/**
 * 枚举开放接口管理相关的api
 */
export enum OpenInterfaceApi {
  OpenInterfaceManage = '/staff/open/api/user',
  OpenInterfaceManageByPage = '/staff/open/api/user/page',
  OpenInterface = '/staff/open/api/user',
  OpenInterfaceBusiness = '/staff/open/api/grant/',
}

/**
 * 分页查询开放接口数据
 * @param params 开放接口参数
 * @returns 开放接口列表
 */
export const getOpenInterfaceManageByPage = (params: OpenInterfaceParams) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: OpenInterfaceApi.OpenInterfaceManageByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 查看开放接口详情
 * @param id 开放接口参数
 * @returns 开放接口列表
 */
export const getOpenInterfaceDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: OpenInterfaceApi.OpenInterfaceManage + '/' + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增开放接口
 * @param id 开放接口参数
 * @returns 开放接口列表
 */
export const addOpenInterface = (params: OpenInterfaceType) => {
  return HttpRequest.post(
    {
      url: OpenInterfaceApi.OpenInterface,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 修改开放接口
 * @param id 开放接口参数
 * @returns 开放接口列表
 */
export const updateOpenInterface = (params: OpenInterfaceType) => {
  return HttpRequest.put(
    {
      url: OpenInterfaceApi.OpenInterface + '/' + params.id,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 获取放接口业务功能
 * @param id 开放接口参数
 * @returns 开放接口列表
 */
export const getOpenInterfaceBusiness = (params: { id: string }) => {
  return HttpRequest.get(
    {
      url: OpenInterfaceApi.OpenInterface + '/' + params.id + '/grants',
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 获取放接口业务功能
 * @param id 开放接口参数
 * @returns 开放接口列表
 */
export const resetOpenInterfaceSecret = (id: string) => {
  return HttpRequest.post(
    {
      url: OpenInterfaceApi.OpenInterface + '/' + id + '/secret/reset',
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增开放接口业务功能
 * @param id 开放接口参数
 * @returns 开放接口列表
 */
export const addOpenInterfaceBusiness = (params: OpenInterfaceBusinessType) => {
  return HttpRequest.post(
    {
      url: OpenInterfaceApi.OpenInterfaceBusiness,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 修改开放接口业务功能
 * @param id 开放接口参数
 * @returns 开放接口列表
 */
export const updateOpenInterfaceBusiness = (
  params: OpenInterfaceBusinessType
) => {
  return HttpRequest.put(
    {
      url: OpenInterfaceApi.OpenInterfaceBusiness + params.id,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 删除开放接口业务功能
 * @param id 开放接口参数
 * @returns 开放接口列表
 */
export const deleteOpenInterfaceBusiness = (id: string) => {
  return HttpRequest.delete(
    {
      url: OpenInterfaceApi.OpenInterfaceBusiness + id,
    },
    {
      isTransformResponse: false,
    }
  );
};
