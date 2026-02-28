import { HttpRequest } from '@/utils/request';
import type { Response } from '@/types/global';

/**
 * 枚举系统配置需要的接口地址
 */
export enum UploadApi {
  uploadFile = '/system/file/upload',
  previewFile = '/system/file/preview/',
  saveFile = '/system/file/save/',
  deleteFile = '/system/file/delete/',
}

/**
 * 上传文件
 */
export const postUploadFile = (params: FormData) => {
  return HttpRequest.post<Response>(
    {
      url: UploadApi.uploadFile,
      params,
    },
    { isTransformResponse: false },
  );
};

/**
 * 保存文件
 */
export const postSaveFile = (id: string) => {
  return HttpRequest.post<Response>(
    {
      url: UploadApi.saveFile + id,
    },
    { isTransformResponse: false },
  );
};

/**
 * 删除文件
 */
export const deleteFile = (id: string) => {
  return HttpRequest.delete<Response>(
    {
      url: UploadApi.deleteFile + id,
    },
    { isTransformResponse: false },
  );
};

/**
 * 预览文件
 */
export const previewPreviewFile = (imageId: string) => {
  return HttpRequest.get(
    {
      url: UploadApi.previewFile + imageId,
      responseType: 'blob',
    },
    { isTransformResponse: false },
  );
};
