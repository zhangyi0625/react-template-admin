import type { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const MemberUnitManageUnitLevelOptions: SelectProps['options'] = [
  {
    label: '会长单位',
    value: 1,
  },
  {
    label: '副会长单位',
    value: 3,
  },
  {
    label: '理事单位',
    value: 5,
  },
  {
    label: '监事单位',
    value: 7,
  },
  {
    label: '会员单位',
    value: 9,
  },
];

export const MemberUnitManageMemberLevelOptions: SelectProps['options'] = [
  {
    label: 'V1',
    value: 1,
  },
  {
    label: 'V2',
    value: 2,
  },
  {
    label: 'V3',
    value: 3,
  },
  {
    label: 'V4',
    value: 4,
  },
  {
    label: 'V5',
    value: 5,
  },
];

export const MemberUnitManageSearchColumns: CustomColumn[] = [
  {
    label: '公司名称',
    name: 'name',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '单位类型',
    name: 'unitLevel',
    formType: 'normalSelect',
    options: MemberUnitManageUnitLevelOptions,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '会员到期日期',
    name: ['memberExpiryDateStart', 'memberExpiryDateEnd'],
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const MemberUnitManageForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '企业名称',
    name: 'name',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '社会统一信用代码',
    name: 'socialCode',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '单位类型',
    name: 'unitLevel',
    formType: 'normalSelect',
    options: MemberUnitManageUnitLevelOptions,
    span: 12,
    isRules: true,
  },
  {
    label: '会员到期日期',
    name: 'memberExpiryDate',
    formType: 'date-picker',
    span: 12,
    isRules: true,
  },
  {
    label: '会员等级',
    name: 'memberLevel',
    formType: 'normalSelect',
    options: MemberUnitManageMemberLevelOptions,
    span: 12,
    isRules: true,
  },
  {
    label: '企业成立日期',
    name: 'establishmentDate',
    formType: 'date-picker',
    span: 12,
  },
  {
    label: '企业联系电话',
    name: 'contactPhone',
    formType: 'input',
    span: 12,
  },
  {
    label: '企业地址',
    name: 'address',
    formType: 'input',
    span: 12,
  },
  {
    label: '企业简介',
    name: 'enterpriseDescription',
    formType: 'textarea',
    span: 24,
  },
];
