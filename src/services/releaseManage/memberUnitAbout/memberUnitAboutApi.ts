import { HttpRequest } from '@/utils/request';
import type {
  MemberUnitAboutSearchParams,
  MemberUnitAboutType,
} from './memberUnitAboutModel';

/**
 * 枚举协会概况相关的api
 */
export enum MemberUnitAboutApi {
  MemberUnitAbout = '/business/association-column',
  MemberUnitAboutByPage = '/business/association-column/page',
}

/**
 * 分页获取协会概况列表
 * @param params 协会概况参数
 * @returns 协会概况列表
 */
export const getMemberUnitAboutListByPage = (
  params: MemberUnitAboutSearchParams,
) => {
  return HttpRequest.get<MemberUnitAboutType[]>(
    {
      url: MemberUnitAboutApi.MemberUnitAboutByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 获取协会概况列表
 * @param params 协会概况参数
 * @returns 协会概况列表
 */
export const getMemberUnitAboutList = (
  params: Partial<MemberUnitAboutSearchParams>,
) => {
  return HttpRequest.get<MemberUnitAboutType[]>(
    {
      url: MemberUnitAboutApi.MemberUnitAboutByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 获取协会概况详情
 * @param params 协会概况详情参数
 * @returns 协会概况详情
 */
export const getMemberUnitAboutDetail = (id: string) => {
  return HttpRequest.get<MemberUnitAboutType>(
    {
      url: MemberUnitAboutApi.MemberUnitAbout + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 创建协会概况
 * @param params 协会概况参数
 * @returns 协会概况详情
 */
export const createMemberUnitAbout = (params: MemberUnitAboutType) => {
  return HttpRequest.post(
    {
      url: MemberUnitAboutApi.MemberUnitAbout,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 更新协会概况
 * @param params 协会概况参数
 * @returns 协会概况详情
 */
export const updateMemberUnitAbout = (params: MemberUnitAboutType) => {
  return HttpRequest.put(
    {
      url: MemberUnitAboutApi.MemberUnitAbout,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 删除协会概况
 * @param params 协会概况删除参数
 * @returns 协会概况详情
 */
export const deleteMemberUnitAbout = (id: string) => {
  return HttpRequest.delete(
    {
      url: MemberUnitAboutApi.MemberUnitAbout + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};
