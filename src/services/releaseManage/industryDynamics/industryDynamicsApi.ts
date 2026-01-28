import { HttpRequest } from '@/utils/request';
import type {
  IndustryDynamicsSearchParams,
  IndustryDynamicsType,
} from './industryDynamicsModel';
import { MemberUnitAboutType } from '../memberUnitAbout/memberUnitAboutModel';

/**
 * 枚举行业动态相关的api
 */
export enum IndustryDynamicsApi {
  IndustryDynamics = '/business/industry-news',
  IndustryDynamicsByPage = '/business/industry-news/page',
  IndustryDynamicsGroup = '/business/column-group',
}

/**
 * 分页获取行业动态列表
 * @param params 行业动态参数
 * @returns 行业动态列表
 */
export const getIndustryDynamicsListByPage = (
  params: IndustryDynamicsSearchParams,
) => {
  return HttpRequest.get<IndustryDynamicsType[]>(
    {
      url: IndustryDynamicsApi.IndustryDynamicsByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 获取行业动态列表
 * @param params 行业动态参数
 * @returns 行业动态列表
 */
export const getIndustryDynamicsList = (
  params: Partial<IndustryDynamicsSearchParams>,
) => {
  return HttpRequest.get<IndustryDynamicsType[]>(
    {
      url: IndustryDynamicsApi.IndustryDynamicsByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 获取行业动态详情
 * @param params 行业动态详情参数
 * @returns 行业动态详情
 */
export const getIndustryDynamicsDetail = (id: string) => {
  return HttpRequest.get<IndustryDynamicsType>(
    {
      url: IndustryDynamicsApi.IndustryDynamics + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 创建行业动态
 * @param params 行业动态参数
 * @returns 行业动态详情
 */
export const createIndustryDynamics = (params: IndustryDynamicsType) => {
  return HttpRequest.post(
    {
      url: IndustryDynamicsApi.IndustryDynamics,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 更新行业动态
 * @param params 行业动态参数
 * @returns 行业动态详情
 */
export const updateIndustryDynamics = (params: IndustryDynamicsType) => {
  return HttpRequest.put(
    {
      url: IndustryDynamicsApi.IndustryDynamics,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 删除行业动态
 * @param params 行业动态删除参数
 * @returns 行业动态详情
 */
export const deleteIndustryDynamics = (id: string) => {
  return HttpRequest.delete(
    {
      url: IndustryDynamicsApi.IndustryDynamics + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 获取行业动态分组列表
 * @param params 行业动态分组参数
 * @returns 行业动态分组列表
 */

export const getIndustryDynamicsGroup = () => {
  return HttpRequest.get(
    {
      url: IndustryDynamicsApi.IndustryDynamicsGroup,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 添加行业动态分组
 * @param params 行业动态分组参数
 * @returns 行业动态分组详情
 */
export const createIndustryDynamicsGroup = (params: MemberUnitAboutType) => {
  return HttpRequest.post(
    {
      url: IndustryDynamicsApi.IndustryDynamicsGroup,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};
