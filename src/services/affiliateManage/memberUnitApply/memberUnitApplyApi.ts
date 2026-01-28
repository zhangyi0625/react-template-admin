import { HttpRequest } from '@/utils/request';
import type { MemberUnitApplySearchParams } from './memberUnitApplyModel';

/**
 * 枚举协会申请相关的api
 */
export enum MemberUnitApplyApi {
  MemberUnitApply = '/business/association-apply/page',
}

/**
 * 分页获取协会申请列表
 * @param params 协会申请参数
 * @returns 协会申请列表
 */

export const getMemberUnitApplyListByPage = (
  params: MemberUnitApplySearchParams,
) => {
  return HttpRequest.get(
    {
      url: MemberUnitApplyApi.MemberUnitApply,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};
