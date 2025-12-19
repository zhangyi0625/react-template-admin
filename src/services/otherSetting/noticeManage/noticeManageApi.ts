import { HttpRequest } from '@/utils/request';
import type {
  NoticeManageEditType,
  NoticeManageSearchParams,
} from './noticeManageModel';

/**
 * 枚举公告管理相关的api
 */
export enum NoticeManageApi {
  NoticeManage = '/staff/bulletin/',
  NoticeManageByList = '/staff/bulletin/page',
}

/**
 * 查询公告管理数据
 * @returns 公告管理列表
 */
export const getNoticeManageByList = (params: NoticeManageSearchParams) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: NoticeManageApi.NoticeManageByList,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 查询公告管理详情
 * @returns 公告管理列表
 */
export const getNoticeManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: NoticeManageApi.NoticeManage + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 新增服务费保证金规则
 * @param params 公告管理参数
 * @returns 公告管理列表
 */
export const addNoticeManage = (params: NoticeManageEditType) => {
  return HttpRequest.post(
    {
      url: NoticeManageApi.NoticeManage,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 修改服务费保证金规则
 * @param params 公告管理参数
 * @returns 公告管理列表
 */
export const updateNoticeManage = (
  params: NoticeManageEditType,
  id: string
) => {
  return HttpRequest.put(
    {
      url: NoticeManageApi.NoticeManage + id,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 删除服务费保证金规则
 * @returns 公告管理列表
 */
export const deleteNoticeManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: NoticeManageApi.NoticeManage + id,
    },
    {
      isTransformResponse: false,
    }
  );
};
