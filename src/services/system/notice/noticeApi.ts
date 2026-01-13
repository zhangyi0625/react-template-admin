import { HttpRequest } from '@/utils/request';
import type { NoticeManageSearchParams, NoticeManageType } from './noticeModel';
import { filterKeys } from '@/utils/tool';

/**
 * 枚举用户相关的api
 */
export enum NoticeManageApi {
  NoticeManage = '/business/announcement',
  NoticeManageByPage = '/business/announcement/page',
  batchNoticeManage = '/business/announcement/batch',
}

/**
 * 查询所有公告管理
 * @returns 公告管理
 */
export const getNoticeManage = () => {
  return HttpRequest.get(
    {
      url: NoticeManageApi.NoticeManage,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 分页查询公告管理
 * @param params 用户参数
 * @returns 公告管理
 */
export const getNoticeManageByPage = (params: NoticeManageSearchParams) => {
  let qsParams = {
    ...filterKeys(params, ['filter'], false),
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: NoticeManageApi.NoticeManageByPage,
      params: qsParams,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 查询用户详细信息
 * @returns 公告管理
 */
export const getNoticeDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: NoticeManageApi.NoticeManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 新增用户
 * @param params 用户参数
 * @returns 结果
 */
export const addNoticeManage = (params: NoticeManageType) => {
  return HttpRequest.post({
    url: NoticeManageApi.NoticeManage,
    data: params,
  });
};

/**
 * 编辑用户信息
 * @param params 用户参数
 * @returns 结果
 */
export const editNoticeManage = (params: NoticeManageType) => {
  return HttpRequest.put({
    url: NoticeManageApi.NoticeManage,
    data: params,
  });
};

/**
 * 删除用户信息
 * @returns 公告管理
 */
export const deleteNoticeManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: NoticeManageApi.NoticeManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  );
};

/**
 * 批量删除用户信息
 * @returns 公告管理
 */
export const deletebatchUserList = (ids: string[]) => {
  return HttpRequest.delete(
    {
      url: NoticeManageApi.batchNoticeManage,
      params: ids,
    },
    {
      successMessageMode: 'none',
    }
  );
};
