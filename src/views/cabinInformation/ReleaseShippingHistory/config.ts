import { getSystemOrderCarrier } from '@/services/system/basicData/basicDataApi';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const ReleaseShippingHistorySearchColumns: CustomColumn[] = [
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
    label: '起运港名称',
    name: 'porCode',
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
    label: '目的港名称',
    name: 'fndCode',
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
      tag: 'FND',
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
    label: '航线',
    name: 'areaId',
    formType: 'normalSelect',
    span: 6,
    options: [],
    selectFetch: false,
    hiddenItem: false,
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
  },
  {
    label: 'ETD',
    name: ['etdStart', 'etdEnd'],
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '创建时间',
    name: 'created',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const ReleaseShippingHistoryForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '船公司',
    name: 'carrier',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFieldName: {
      label: 'carrierCode',
      value: 'carrierCode',
    },
    isRules: true,
  },
  {
    label: '起运港',
    name: 'porCode',
    formType: 'focusSelect',
    options: [],
    span: 6,
    isRules: true,
  },
  {
    label: '目的港',
    name: 'fndCode',
    formType: 'focusSelect',
    options: [],
    span: 6,
    isRules: true,
  },
  {
    label: '箱型',
    name: 'ctnType',
    formType: 'normalSelect',
    options: [],
    span: 6,
    isRules: true,
  },
];
