import { HttpRequest } from '@/utils/request';
import type { InvoiceApplySearchParams } from './invoiceApplyModel';

/**
 * 枚举开票申请相关的api
 */
export enum InvoiceApplyApi {
  InvoiceApply = '/staff/invoice/approval',
  InvoiceApplyByPage = '/staff/invoice/approval/page',
  InvoiceApplyOrderImport = '/staff/invoice/approval/items/',
  InvoiceApplyRecord = '/staff/invoice/approval/event/',
  InvoiceApplyFile = '/staff/invoice/approval/file/',
  InvoiceApplyUploadFile = '/staff/invoice/approval/upload/',
}

/**
 * @description 分页获取开票申请列表
 * @param params 开票申请参数
 * @returns 开票申请列表
 */
export const getInvoiceApplyListByPage = (params: InvoiceApplySearchParams) => {
  let qsParams = {
    ...params,
    filter: JSON.stringify(params.filter),
  };
  return HttpRequest.get(
    {
      url: InvoiceApplyApi.InvoiceApplyByPage,
      params: qsParams,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取开票申请
 * @param id 开票申请参数
 * @returns 开票申请列表
 */
export const getInvoiceApply = (id: string) => {
  return HttpRequest.get(
    {
      url: InvoiceApplyApi.InvoiceApply + '/' + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取开票申请包含订单
 * @param id 开票申请参数
 * @returns 开票申请列表
 */
export const getInvoiceApplyOrderImport = (id: string) => {
  return HttpRequest.get(
    {
      url: InvoiceApplyApi.InvoiceApplyOrderImport + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取开票申请操作记录
 * @param id 开票申请参数
 * @returns 开票申请列表
 */
export const getInvoiceApplyRecord = (id: string) => {
  return HttpRequest.get(
    {
      url: InvoiceApplyApi.InvoiceApplyRecord + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 获取开票申请 发票记录
 * @param id 开票申请参数
 * @returns 开票申请列表
 */
export const getInvoiceApplyFile = (id: string) => {
  return HttpRequest.get(
    {
      url: InvoiceApplyApi.InvoiceApplyFile + id,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 开票申请 提交发票记录
 * @param params 开票申请参数
 * @param id 开票申请参数
 * @returns 开票申请列表
 */
export const postInvoiceApplyUploadFile = (params: FormData, id: string) => {
  return HttpRequest.post<Response>(
    {
      url: InvoiceApplyApi.InvoiceApplyUploadFile + id,
      params: params,
    },
    {
      isTransformResponse: false,
    },
  );
};

/**
 * @description 开票申请 删除发票
 * @param id 开票申请参数
 * @returns 开票申请列表
 */
export const deleteInvoiceApplyFile = (id: string) => {
  return HttpRequest.delete(
    {
      url: InvoiceApplyApi.InvoiceApplyFile + id,
    },
    {
      isTransformResponse: false,
    },
  );
};
