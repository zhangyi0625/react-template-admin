import { HttpRequest } from '@/utils/request';
import type { UserInvitationRecordSearchParams } from './userInvitationRecordModel';

/**
 * 枚举用户邀请记录相关的api
 */
export enum UserInvitationRecordApi {
  UserInvitationRecordByPage = '/staff/customer/inviting/page',
}

/**
 * 分页获取用户邀请记录列表
 * @param params 用户邀请记录参数
 * @returns 用户邀请记录列表
 */
export const getUserInvitationRecordListByPage = (
  params: UserInvitationRecordSearchParams
) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: UserInvitationRecordApi.UserInvitationRecordByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};
