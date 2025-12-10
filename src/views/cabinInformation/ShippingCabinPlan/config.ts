import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { getSystemOrderCarrier } from '@/services/system/basicData/basicDataApi';
import { CheckboxOptionType, SelectProps } from 'antd';

export const ShippingCabinPlanSearchColumns: CustomColumn[] = [
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
    name: 'porCode',
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
    label: '目的港',
    name: 'fndCode',
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
    name: 'carrierRoute',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const ShippingCabinPlanFormMaps: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '船公司',
    name: 'carrier',
    formType: 'normalSelect',
    options: [],
    selectFileldName: {
      label: 'carrierCode',
      value: 'carrierCode',
    },
    selectResultKey: null,
    span: 6,
    isRules: true,
  },
  {
    label: '航线',
    name: 'carrierRoute',
    formType: 'input',
    span: 6,
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
];

export const planModeOptions: CheckboxOptionType[] = [
  {
    label: '按天',
    value: 'DAY',
  },
  {
    label: '按周',
    value: 'WEEK',
  },
];
