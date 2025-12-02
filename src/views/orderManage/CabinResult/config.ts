import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { getSystemOrderCarrier } from '@/services/system/basicData/basicDataApi';
import { changeSelectOptionsByLabel } from '@/utils/options';

export const CabinResultSearchColumns: CustomColumn[] = [
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
    label: '起运港',
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
    name: 'fnd',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '状态',
    name: 'status',
    formType: 'normalSelect',
    span: 6,
    options: changeSelectOptionsByLabel(['已关联', '未关联']),
    selectFetch: false,
    hiddenItem: false,
  },
];

export const RelevanceOrderOptions: CustomColumn[] = [
  {
    label: '目的港',
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
    span: 12,
    selectFetch: true,
    hiddenItem: false,
  },
];
