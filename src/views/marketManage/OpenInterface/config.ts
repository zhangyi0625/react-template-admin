import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const OpenInterfaceSearchColumns: CustomColumn[] = [
  {
    label: '接入名称',
    name: 'name',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '公司名称',
    name: 'affiliateId',
    formType: 'focusSelect',
    options: [],
    selectFileldName: {
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
    selectFileldName: {
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
    label: 'API Key',
    name: 'key',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const OpenInterfaceForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '接口名称',
    name: 'name',
    formType: 'input',
    span: 12,
  },
  {
    label: '用户名',
    name: 'customerId',
    formType: 'focusSelect',
    customPlaceholder: '输入用户名',
    options: [],
    span: 12,
  },
  {
    label: 'IP白名单',
    name: 'ipAllows',
    formType: 'textarea',
    span: 12,
    customPlaceholder: 'IP或IP段，多个时用逗号分隔',
  },
  {
    label: '回调地址',
    name: 'callback',
    formType: 'textarea',
    span: 12,
    customPlaceholder: '业务回调地址URL',
  },
  {
    label: '状态',
    name: 'valid',
    formType: 'radio',
    span: 12,
  },
  {
    label: '备注',
    name: 'remarks',
    formType: 'textarea',
    span: 12,
    customPlaceholder: '填写备注',
  },
];

export const OpenInterfaceBusinessForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '业务功能',
    name: 'item',
    formType: 'normalSelect',
    span: 12,
    isRules: true,
  },
  {
    label: '最大请求速率',
    name: 'rateLimit',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '有效期',
    name: 'validTo',
    formType: 'date-picker',
    span: 12,
  },
];
