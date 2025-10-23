import { HttpRequest } from '@/utils/request';
import type { Response } from '@/types/global';

/**
 * 枚举系统配置需要的接口地址
 */
export enum UploadApi {
  uploadFile = '/api/file/upload',
  getFileUrl = '/staff/file/',
}

/**
 * 查询系统参数
 */
export const postUploadFile = (params: FormData) => {
  return HttpRequest.post<Response>(
    {
      url: UploadApi.uploadFile,
      params,
    },
    { isTransformResponse: false }
  );
};

/**
 * 获取源文件
 * @param params
 * @returns
 */
export const getFileUrl = (id: string) => {
  return HttpRequest.get<Response>(
    {
      url: UploadApi.getFileUrl + id,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  );
};
