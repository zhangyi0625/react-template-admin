import { HttpRequest } from '@/utils/request';
import type { PacketManageParams, PacketManageType } from './packetManageModel';

/**
 * 枚举活动红包相关的api
 */
export enum PacketApi {
  PacketManage = '/activity/',
  PacketManageByPage = '/activity/page',
  SavePacket = '/activity/save',
  PacketRecord = '/activity/claim/user/',
  PacketRecordDetail = '/activity/award/info/',
}

/**
 * 分页查询活动红包列表
 * @param params 活动红包参数
 * @returns 活动红包列表
 */
export const getPacketListByPage = (params: PacketManageParams) => {
  return HttpRequest.get(
    {
      url: PacketApi.PacketManageByPage,
      params: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 编辑活动红包信息
 * @param params 活动红包参数
 * @returns 结果
 */
export const editPacketList = (params: PacketManageType) => {
  return HttpRequest.post(
    {
      url: PacketApi.SavePacket,
      data: params,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 修改活动红包状态
 * @param params 活动红包参数
 * @returns 结果
 */
export const updatePacketStatus = (id: string, status: number) => {
  return HttpRequest.put(
    {
      url: PacketApi.PacketManage + '/' + id + '/status?status=' + status,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 删除活动红包信息
 * @returns 活动红包列表
 */
export const deletePacketList = (id: string) => {
  return HttpRequest.delete(
    {
      url: PacketApi.PacketManage + '/' + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 查询活动红包领取记录
 * @param params 活动红包参数
 * @returns 活动红包列表
 */
export const getPacketRecord = (id: string) => {
  return HttpRequest.get(
    {
      url: PacketApi.PacketRecord + '/' + id,
    },
    {
      isTransformResponse: false,
    }
  );
};

/**
 * 查询活动红包领取记录详情
 * @param params 活动红包参数
 * @returns 活动红包列表
 */
export const getPacketRecordDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: PacketApi.PacketRecordDetail + '/' + id,
    },
    {
      isTransformResponse: false,
    }
  );
};
