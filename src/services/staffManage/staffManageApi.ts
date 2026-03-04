import { HttpRequest } from '@/utils/request';
import type {
  SysStaffResetPasswordType,
  SysStaffParams,
  SysStaffType,
} from './staffManageModel';

/**
 * 枚举用户相关的api
 */
export enum StaffApi {
  StaffManage = '/staff/staff',
  StaffManageByPage = '/staff/staff/page',
  ResetStaffPassword = '/staff/password',
  SendVerifyCode = '/staff/verify-code',
}

/**
 * @description 查询所有用户列表
 * @returns 用户列表
 */
export const getStaffList = () => {
  return HttpRequest.get(
    {
      url: StaffApi.StaffManage,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 分页查询用户列表
 * @param params 用户参数
 * @returns 用户列表
 */
export const getStaffListByPage = (params: SysStaffParams) => {
  return HttpRequest.get(
    {
      url: StaffApi.StaffManageByPage,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 查询用户详情信息
 * @param id 用户id
 * @returns 用户列表
 */
export const getStaffDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: StaffApi.StaffManage + '/' + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 新增用户
 * @param params 用户参数
 * @returns 结果
 */
export const addStaffList = (params: SysStaffType) => {
  return HttpRequest.post(
    {
      url: StaffApi.StaffManage,
      data: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 编辑用户信息
 * @param params 用户参数
 * @param id 用户id
 * @returns 结果
 */
export const editStaffList = (params: SysStaffType, id: string) => {
  return HttpRequest.put(
    {
      url: StaffApi.StaffManage + '/' + id,
      data: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 发送验证码
 * @param params 用户参数
 * @returns 结果
 */
export const postSendVerifyCode = () => {
  return HttpRequest.post(
    {
      url: StaffApi.SendVerifyCode,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 重置用户密码
 * @param params 用户参数
 * @returns 结果
 */
export const updateStaffPassword = (params: SysStaffResetPasswordType) => {
  return HttpRequest.post(
    {
      url: StaffApi.ResetStaffPassword,
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
 * @returns 用户列表
 */
export const deleteStaffList = (id: string) => {
  return HttpRequest.delete(
    {
      url: StaffApi.StaffManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};
