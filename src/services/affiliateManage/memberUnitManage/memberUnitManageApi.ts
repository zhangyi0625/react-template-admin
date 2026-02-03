import { HttpRequest } from '@/utils/request';
import type {
  CompanyMemberRecordType,
  MemberUnitManageSearchParams,
  MemberUnitManageType,
} from './memberUnitManageModel';

/**
 * 枚举会员单位管理相关的api
 */
export enum MemberUnitManageApi {
  MemberUnitManage = '/business/company',
  MemberUnitManageByPage = '/business/company/page',
  AddEmployeeToCompany = '/business/company/addEmployeeToCompany',
  AssignCompanyMaster = '/business/company/assignCompanyMaster/',
  CompanyImage = '/business/company-image',
  CompanyMemberRecord = '/business/company-member',
  RemoveCustomer = '/business/company/removeCustomer/',
}

/**
 * 分页获取会员单位管理列表
 * @param params 会员单位管理参数
 * @returns 会员单位管理列表
 */
export const getMemberUnitManageListByPage = (
  params?: MemberUnitManageSearchParams,
) => {
  return HttpRequest.get(
    {
      url: MemberUnitManageApi.MemberUnitManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 会员单位管理列表
 * @param params 会员单位管理参数
 * @returns 会员单位管理列表
 */
export const getMemberUnitManageList = (
  params?: MemberUnitManageSearchParams,
) => {
  return HttpRequest.get(
    {
      url: MemberUnitManageApi.MemberUnitManage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 会员单位管理详情
 * @param params 会员单位管理参数
 * @returns 会员单位管理列表
 */
export const getMemberUnitManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: MemberUnitManageApi.MemberUnitManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 新增会员单位管理
 * @param params 会员单位管理参数
 */
export const addMemberUnitManage = (params: MemberUnitManageType) => {
  return HttpRequest.post(
    {
      url: MemberUnitManageApi.MemberUnitManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 修改会员单位管理
 * @param params 会员单位管理参数
 */
export const updateMemberUnitManage = (params: MemberUnitManageType) => {
  return HttpRequest.put(
    {
      url: MemberUnitManageApi.MemberUnitManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 删除会员单位管理
 * @param params 会员单位管理参数
 */
export const deleteMemberUnitManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: MemberUnitManageApi.MemberUnitManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 新增会员单位管理员工
 * @param params 会员单位管理员工参数
 */
export const addEmployeeToCompany = (params: {
  companyId: string;
  customerIds: string[];
}) => {
  return HttpRequest.post(
    {
      url: MemberUnitManageApi.AddEmployeeToCompany,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 修改会员单位管理员工
 * @param params 会员单位管理员工参数
 */

export const editEmployeeToCompany = (params: {
  companyId: string;
  customerIds: string[];
}) => {
  return HttpRequest.post(
    {
      url: MemberUnitManageApi.AddEmployeeToCompany,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 分配会员单位负责人
 * @param params 会员单位负责人参数
 */
export const assignCompanyMaster = (companyId: string) => {
  return HttpRequest.post(
    {
      url: MemberUnitManageApi.AssignCompanyMaster + companyId,
      data: {},
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 删除单位成员
 */
export const deleteRemoveCustomer = (id: string) => {
  return HttpRequest.post(
    {
      url: MemberUnitManageApi.RemoveCustomer + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 会员单位图片上传
 * @param params 会员单位图片上传参数
 */
export const uploadCompanyImage = (params: {
  companyId: string;
  imageId: string;
}) => {
  return HttpRequest.post(
    {
      url: MemberUnitManageApi.CompanyImage,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 会员单位图片查询
 * @param params 会员单位图片查询参数
 */
export const getCompanyImageDetail = (companyId: string) => {
  return HttpRequest.get(
    {
      url: MemberUnitManageApi.CompanyImage + '/' + companyId,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 会员单位图片删除
 * @param params 会员单位图片删除参数
 */
export const deleteCompanyImage = (id: string) => {
  return HttpRequest.delete(
    {
      url: MemberUnitManageApi.CompanyImage + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 会员单位管理入会记录查询
 * @param params 会员单位管理入会记录查询参数
 */
export const getCompanyMemberRecord = (companyId: string) => {
  return HttpRequest.get(
    {
      url: MemberUnitManageApi.CompanyMemberRecord + '/' + companyId,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 会员单位管理入会记录新增
 * @param params 会员单位管理入会记录新增参数
 */
export const addCompanyMemberRecord = (params: CompanyMemberRecordType) => {
  return HttpRequest.post(
    {
      url: MemberUnitManageApi.CompanyMemberRecord,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 会员单位管理入会记录修改
 * @param params 会员单位管理入会记录修改参数
 */
export const editCompanyMemberRecord = (params: CompanyMemberRecordType) => {
  return HttpRequest.put(
    {
      url: MemberUnitManageApi.CompanyMemberRecord,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * 会员单位管理入会记录删除
 * @param params 会员单位管理入会记录删除参数
 */
export const deleteCompanyMemberRecord = (id: string) => {
  return HttpRequest.delete(
    {
      url: MemberUnitManageApi.CompanyMemberRecord + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  );
};
