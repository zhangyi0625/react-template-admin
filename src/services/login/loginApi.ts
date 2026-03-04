import { HttpRequest } from '@/utils/request';
import type { Response } from '@/types/global';
import type { LoginType } from './loginModal';

/**
 * 枚举登录需要的接口地址
 */
export enum LoginApi {
  /**
   * 登录
   */
  login = '/staff/login',

  /**
   * 退出登录
   */
  logout = '/logout',
  /**
   * 获取验证码
   */
  getCode = '/user/captcha',
}

/**
 * @description 登录接口的实现
 * @param params 登录参数
 * @returns 登录结果
 */
export const login = (params: LoginType) => {
  return HttpRequest.post<Response>(
    {
      url: LoginApi.login,
      data: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取验证码
 * @param checkKey 校验参数
 * @returns 验证码
 */
export const getCaptcha = (checkKey: string) => {
  return HttpRequest.get(
    {
      url: `${LoginApi.getCode}?${checkKey}`,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * @description 用户退出登录
 * @param token 用户token
 */
export const logout = (token: string) => {
  HttpRequest.delete({ url: LoginApi.logout, params: { token } });
};
