import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { getSystemOrderCarrier } from '@/services/system/basicData/basicDataApi';
import { CabinManageChannelOptions } from '../CabinManage/config';

export const RouteManageSearchColumns: CustomColumn[] = [
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
    label: '舱位分类',
    name: 'channel',
    formType: 'normalSelect',
    span: 6,
    options: CabinManageChannelOptions,
    selectFetch: false,
    hiddenItem: false,
    defaultValue: 'CARRIER',
  },
  {
    label: '起运港名称',
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
    label: '目的港名称',
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
    name: 'route',
    formType: 'normalSelect',
    span: 6,
    options: [],
    selectFetch: false,
    hiddenItem: false,
    selectFieldName: {
      label: 'name',
      value: 'code',
    },
  },
  {
    label: '更新时间',
    name: 'updated',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    customPlaceholder: ['起始更新时间', '结束更新时间'],
  },
];
