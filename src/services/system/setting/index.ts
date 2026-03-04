import { HttpRequest } from '@/utils/request';
import type { Response } from '@/types/global';

/**
 * 枚举系统配置需要的接口地址
 */
export enum PublicApi {
  PublicData = '/common/public-data',
  PublicSetting = '/common/public-settings',
}

/**
 * @description 查询系统参数
 * @returns 系统参数
 */
export const getPublicData = () => {
  return HttpRequest.get<Response>(
    {
      url: PublicApi.PublicData,
    },
    { isTransformResponse: false },
  );
};

/**
 * @description 查询系统配置
 * @returns 系统配置
 */
export const getPublicSetting = () => {
  return HttpRequest.get<Response>(
    {
      url: PublicApi.PublicSetting,
    },
    { isTransformResponse: false },
  );
};
