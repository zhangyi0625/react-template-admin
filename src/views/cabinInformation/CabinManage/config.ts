import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { getSystemOrderCarrier } from '@/services/system/basicData/basicDataApi';
import { SelectProps } from 'antd';

export const CabinManageChannelOptions: SelectProps['options'] = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '庄家舱位',
    value: 'CUSTOMER',
  },
  {
    label: '船公司舱位',
    value: 'CARRIER',
  },
];

export const CabinManageSearchColumns: CustomColumn[] = [
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
    label: '起运港名称',
    name: 'porId',
    formType: 'focusSelect',
    options: [],
    selectFileldName: {
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
    name: 'fndId',
    formType: 'focusSelect',
    options: [],
    selectFileldName: {
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
    label: '航线',
    name: 'route',
    formType: 'normalSelect',
    span: 6,
    options: [],
    selectFetch: false,
    hiddenItem: false,
    selectFileldName: {
      label: 'name',
      value: 'code',
    },
  },
  {
    label: '船名',
    name: 'vesselName',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '航次',
    name: 'voyNo',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: 'ETD',
    name: 'etd',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '有效时间',
    name: 'valid',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '舱位分类',
    name: 'channel',
    formType: 'normalSelect',
    span: 6,
    options: CabinManageChannelOptions,
    selectFetch: false,
    hiddenItem: false,
    defaultValue: '',
  },
];
