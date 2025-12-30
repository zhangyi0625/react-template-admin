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
 * 查询所有用户列表
 * @returns 用户列表
 */
export const getUserList = () => {
  return HttpRequest.get(
    {
      url: UserApi.UserManage,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 分页查询用户列表
 * @param params 用户参数
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
    }
  );
};

/**
 * 查询用户详情信息
 * @param params 用户参数
 * @returns 用户列表
 */
export const getUserDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: UserApi.UserManage + '/' + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增用户
 * @param params 用户参数
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
    }
  );
};

/**
 * 编辑用户信息
 * @param params 用户参数
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
    }
  );
};

/**
 * 发送验证码
 * @param params 用户参数
 * @returns 结果
 */
export const postSendVerifyCode = () => {
  return HttpRequest.post(
    {
      url: UserApi.SendVerifyCode,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 重置用户密码
 * @param params 用户参数
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
    }
  );
};

/**
 * 删除用户信息
 * @returns 用户列表
 */
export const deleteUserList = (id: string) => {
  return HttpRequest.delete(
    {
      url: UserApi.UserManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 批量删除用户信息
 * @returns 用户列表
 */
export const deleteBatchUserList = (ids: string[]) => {
  return HttpRequest.delete(
    {
      url: UserApi.batchUserManage,
      params: ids,
    },
    {
      successMessageMode: 'none',
    }
  );
};
