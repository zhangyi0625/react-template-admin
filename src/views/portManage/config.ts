import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import type { SelectProps } from 'antd';
import { changeSelectOptionsByLabel } from '@/utils/options';

export const PortTagsOptions: SelectProps['options'] = [
  {
    label: '主要港口',
    value: 'PPO',
  },
  {
    label: '起运港',
    value: 'POR',
  },
  {
    label: '目的港',
    value: 'FND',
  },
  {
    label: '内陆点',
    value: 'LDP',
  },
];

export const ShippingCompanyUnmatchedType: SelectProps['options'] = [
  {
    label: '我司港口为空',
    value: 1,
  },
  {
    label: '船司港口为空',
    value: 2,
  },
  {
    label: '我司或船司港口为空',
    value: 3,
  },
];

export const OurCompanyPortSearchColumns: CustomColumn[] = [
  {
    label: '五字码',
    name: 'code',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '港口名称',
    name: 'name',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '所属国家',
    name: 'countryCode',
    formType: 'normalSelect',
    options: [],
    selectFieldName: {
      label: 'localName',
      value: 'code',
    },
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const OurCompanyPortForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '国际五字码',
    name: 'unlocode',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '航线',
    name: 'parentAreaId',
    formType: 'normalSelect',
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '国内五字码',
    name: 'localCode',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '细分航线',
    name: 'areaId',
    formType: 'normalSelect',
    options: [],
    span: 12,
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    isRules: true,
  },
  {
    label: '名称',
    name: 'name',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '所属国家',
    name: 'countryId',
    formType: 'normalSelect',
    options: [],
    selectFieldName: {
      label: 'localName',
      value: 'id',
    },
    span: 12,
    isRules: true,
  },
  {
    label: '港口中文名称',
    name: 'localName',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '标签',
    name: 'tags',
    formType: 'normalSelect',
    options: PortTagsOptions,
    span: 12,
  },
  {
    label: '是否热门',
    name: 'popularity',
    formType: 'normalSelect',
    options: changeSelectOptionsByLabel(),
    span: 12,
  },
];

export const ShippingCompanyPortSearchColumns: CustomColumn[] = [
  {
    label: '船公司',
    name: 'carrier',
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
    label: '船司港口代码',
    name: 'code',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '船司港口名称',
    name: 'name',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '对应我司港口',
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
    label: '未匹配筛选',
    name: 'unmatchedType',
    formType: 'normalSelect',
    options: ShippingCompanyUnmatchedType,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];
