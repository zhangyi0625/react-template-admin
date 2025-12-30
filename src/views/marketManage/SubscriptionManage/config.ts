import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { changeSelectOptionsByLabel } from '@/utils/options';
import { getSystemOrderCarrier } from '@/services/system/basicData/basicDataApi';

export const SubscriptionManageSearchColumns: CustomColumn[] = [
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
    label: '船公司',
    name: 'carrier',
    formType: 'normalSelect',
    options: [],
    api: getSystemOrderCarrier,
    selectFieldName: {
      label: 'carrierCode',
      value: 'carrierCode',
    },
    selectResultKey: null,
    span: 6,
    selectFetch: true,
    hiddenItem: false,
  },
  {
    label: '起运港',
    name: 'porId',
    formType: 'focusSelect',
    options: [],
    selectFieldName: {
      label: 'localName',
      value: 'unlocode',
    },
    apiByUrl: '/api/common/location/list',
    apiByUrlMethod: 'get',
    setSearchKey: 'keyword',
    apiByUrlParams: {
      tag: 'POR',
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
    label: '目的港',
    name: 'fndId',
    formType: 'focusSelect',
    options: [],
    selectFieldName: {
      label: 'localName',
      value: 'unlocode',
    },
    apiByUrl: '/api/common/location/list',
    apiByUrlMethod: 'get',
    setSearchKey: 'keyword',
    apiByUrlParams: {
      tag: 'POR',
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
    label: '订阅状态',
    name: 'disable',
    formType: 'normalSelect',
    options: changeSelectOptionsByLabel(['暂停订阅', '订阅中']),
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
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
];
