import { HttpRequest } from '@/utils/request';
import type {
  SysUserResetPasswordType,
  SysUserParams,
  SysUserType,
} from './userModel';

/**
 * 枚举用户相关的api
 */
export enum UserApi {
  UserManage = '/staff/staff',
  UserManageByPage = '/staff/staff/page',
  batchUserManage = '/system/user/batch',
  ResetUserPassword = '/staff/password',
  SendVerifyCode = '/staff/verify-code',
}

/**
 * @description 查询所有用户列表
 * @returns 用户列表
 */
export const getUserList = () => {
  return HttpRequest.get(
    {
      url: UserApi.UserManage,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 分页查询用户列表
 * @param params 查询用户参数
 * @returns 用户列表
 */
export const getUserListByPage = (params: SysUserParams) => {
  return HttpRequest.get(
    {
      url: UserApi.UserManageByPage,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 查询用户详情信息
 * @param params 查询用户参数
 * @returns 用户详情
 */
export const getUserDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: UserApi.UserManage + '/' + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 新增用户
 * @param params 新增用户参数
 * @returns 结果
 */
export const addUserList = (params: SysUserType) => {
  return HttpRequest.post(
    {
      url: UserApi.UserManage,
      data: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 编辑用户信息
 * @param params 编辑用户参数
 * @returns 结果
 */
export const editUserList = (params: SysUserType, id: string) => {
  return HttpRequest.put(
    {
      url: UserApi.UserManage + '/' + id,
      data: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 发送验证码
 * @returns 结果
 */
export const postSendVerifyCode = () => {
  return HttpRequest.post(
    {
      url: UserApi.SendVerifyCode,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 重置用户密码
 * @param params 重置用户密码参数
 * @returns 结果
 */
export const updateUserPassword = (params: SysUserResetPasswordType) => {
  return HttpRequest.post(
    {
      url: UserApi.ResetUserPassword,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * @description 删除用户信息
 * @param id 用户id
 * @returns 结果
 */
export const deleteUserList = (id: string) => {
  return HttpRequest.delete(
    {
      url: UserApi.UserManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * @description 批量删除用户信息
 * @param ids 用户id列表
 * @returns 结果
 */
export const deleteBatchUserList = (ids: string[]) => {
  return HttpRequest.delete(
    {
      url: UserApi.batchUserManage,
      params: ids,
    },
    {
      successMessageMode: 'none',
    },
  );
};
