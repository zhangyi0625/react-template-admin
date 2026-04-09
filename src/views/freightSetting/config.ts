import type { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { changeSelectOptionsByLabel } from '@/utils/options';

export const FreightTaskConfigurationSource: SelectProps['options'] = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '壹沓',
    value: 'Y_DATA',
  },
  {
    label: '船司引擎',
    value: 'CARRIER_ENGINE',
  },
];

export const FreightTaskConfigurationSearchColumns: CustomColumn[] = [
  {
    label: '船公司',
    name: 'carrierCode',
    formType: 'normalSelect',
    options: [],
    selectFieldName: {
      label: 'carrierCode',
      value: 'carrierCode',
    },
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '来源',
    name: 'source',
    formType: 'normalSelect',
    options: FreightTaskConfigurationSource,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    defaultValue: '',
  },
  {
    label: '状态',
    name: 'isEnabled',
    formType: 'normalSelect',
    options: changeSelectOptionsByLabel(['开启', '关闭']),
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    defaultValue: 0,
  },
];

export const FreightTaskConfigurationForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '船公司',
    name: 'carrierCode',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFieldName: {
      label: 'carrierCode',
      value: 'carrierCode',
    },
  },
  {
    label: '起运港',
    name: 'porCode',
    formType: 'focusSelect',
    options: [],
    span: 6,
  },
  {
    label: '目的港',
    name: 'fndCode',
    formType: 'focusSelect',
    options: [],
    span: 6,
  },
  {
    label: '运输条款',
    name: 'transClause',
    formType: 'normalSelect',
    options: changeSelectOptionsByLabel(['CY-CY', 'CY-SD']),
    span: 6,
  },
  {
    label: '来源',
    name: 'source',
    formType: 'normalSelect',
    options: FreightTaskConfigurationSource.filter((item) => item.value),
    span: 6,
  },
  {
    label: '船司账号',
    name: 'username',
    formType: 'input',
    span: 6,
  },
  {
    label: '船司账号密码',
    name: 'password',
    formType: 'input',
    span: 6,
  },
  {
    label: 'etd相距天数',
    name: 'etdOffsetDay',
    formType: 'input',
    span: 6,
  },
];

export const SendCustomizationFreightSearchColumns: CustomColumn[] = [
  {
    label: '公司名称',
    name: 'affiliateId',
    formType: 'focusSelect',
    options: [],
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    apiByUrl: '/api/staff/customer/affiliate/list',
    apiByUrlMethod: 'get',
    setSearchKey: 'keyword',
    apiByUrlParams: {
      keyword: null,
    },
    apiByUrlHeaders: {
      authorization: 'Bearer ' + sessionStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    span: 6,
    selectFetch: true,
    hiddenItem: false,
  },
  {
    label: '用户名',
    name: 'customerId',
    formType: 'focusSelect',
    options: [],
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    apiByUrl: '/api/staff/customer/list',
    apiByUrlMethod: 'get',
    setSearchKey: 'keyword',
    apiByUrlParams: {
      keyword: null,
    },
    apiByUrlHeaders: {
      authorization: 'Bearer ' + sessionStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    span: 6,
    selectFetch: true,
    hiddenItem: false,
  },
  {
    label: '设置发送时间',
    name: 'created',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const SendCustomizationFreightForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '用户名',
    name: 'customerId',
    formType: 'focusSelect',
    options: [],
    span: 6,
    customPlaceholder: '请输入用户名',
    isRules: true,
  },
  {
    label: '设置邮箱',
    name: 'email',
    formType: 'input',
    span: 6,
    isRules: true,
  },
  {
    label: '设置发送时间',
    name: 'execTime',
    formType: 'date-picker',
    span: 6,
    isRules: true,
  },
];
