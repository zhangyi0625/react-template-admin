import type { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { getSystemOrderCarrier } from '@/services/system/basicData/basicDataApi';

export const ShippingAccountTypeOptions: SelectProps['options'] = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '普通账号',
    value: 'WEB',
  },
  {
    label: 'API账号',
    value: 'API',
  },
];

export const ShippingAccountStatusOptions: SelectProps['options'] = [
  {
    label: '未审核',
    value: 0,
  },
  {
    label: '审核成功',
    value: 1,
  },
  {
    label: '系统审核失败',
    value: 2,
  },
  {
    label: '人工审核失败',
    value: 3,
  },
];

export const ShippingAccountSearchColumns: CustomColumn[] = [
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
    label: '客户姓名',
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
    label: '船公司',
    name: 'carrier',
    formType: 'normalSelect',
    options: [],
    api: getSystemOrderCarrier,
    selectFileldName: {
      label: 'carrierCode',
      value: 'carrierCode',
    },
    selectResultKey: null,
    span: 6,
    selectFetch: true,
    hiddenItem: false,
  },
  {
    label: '账号类型',
    name: 'type',
    formType: 'normalSelect',
    options: ShippingAccountTypeOptions,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    defaultValue: '',
  },
  {
    label: '登录名',
    name: 'username',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '公司名称',
    name: 'affiliate',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '状态',
    name: 'status',
    formType: 'normalSelect',
    options: ShippingAccountStatusOptions,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];
