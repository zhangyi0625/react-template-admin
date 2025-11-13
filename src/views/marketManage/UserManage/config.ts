import { SelectProps } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const UserLevelOptions: SelectProps['options'] = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '普通用户',
    value: 0,
  },
  {
    label: '新用户',
    value: 1,
  },
  {
    label: '周卡',
    value: 5,
  },
  {
    label: '年卡',
    value: 7,
  },
  {
    label: '会员',
    value: 9,
  },
];

export const UserFormRadioOptions = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
];

export const UserManageSearchColumns: CustomColumn[] = [
  {
    label: '会员分类',
    name: 'level',
    formType: 'normalSelect',
    options: UserLevelOptions,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    defaultValue: '',
  },
  {
    label: '真实姓名',
    name: 'name',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '手机号',
    name: 'phone',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '公司名称',
    name: 'affiliateName',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const UserManageFormsColumns: Omit<CustomColumn, 'selectFetch'>[] = [
  {
    label: '真实姓名',
    name: 'name',
    formType: 'input',
    span: 12,
    hiddenItem: false,
    isRules: true,
  },
  {
    label: '手机号',
    name: 'phone',
    formType: 'input',
    span: 12,
    hiddenItem: false,
    isRules: true,
  },
  {
    label: '会员分类',
    name: 'level',
    formType: 'normalSelect',
    options: UserLevelOptions,
    span: 12,
    hiddenItem: true,
  },
  {
    label: '常用邮箱',
    name: 'email',
    formType: 'input',
    span: 12,
    hiddenItem: false,
  },
  {
    label: '公司名称',
    name: 'affiliateName',
    formType: 'input',
    span: 12,
    hiddenItem: false,
  },
  {
    label: '普通用户免费有效期',
    name: 'validTo',
    formType: 'input',
    span: 12,
    hiddenItem: false,
  },
  {
    label: '是否有订舱权限',
    name: 'BKG',
    formType: 'radio',
    options: UserFormRadioOptions,
    span: 12,
    hiddenItem: false,
  },
  {
    label: '是否有预定权限',
    name: 'PBK',
    formType: 'radio',
    options: UserFormRadioOptions,
    span: 12,
    hiddenItem: false,
  },
  {
    label: '是否有上传舱位权限',
    name: 'CUP',
    formType: 'radio',
    options: UserFormRadioOptions,
    span: 12,
    hiddenItem: false,
  },
  {
    label: '是否订单免审',
    name: 'OVE',
    formType: 'radio',
    options: UserFormRadioOptions,
    span: 12,
    hiddenItem: false,
  },
  {
    label: '绑定船公司账号权限',
    name: 'CAA',
    formType: 'radio',
    options: UserFormRadioOptions,
    span: 12,
    hiddenItem: false,
  },
  {
    label: '消息订阅权限',
    name: 'NTF',
    formType: 'radio',
    options: UserFormRadioOptions,
    span: 12,
    hiddenItem: false,
  },
];
