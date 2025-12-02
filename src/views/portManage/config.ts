import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { getSystemCountryOptions } from '@/services/system/basicData/basicDataApi';
import { SelectProps } from 'antd';
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
    api: getSystemCountryOptions,
    selectFileldName: {
      label: 'localName',
      value: 'code',
    },
    selectResultKey: null,
    span: 6,
    selectFetch: true,
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
    selectFileldName: {
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
    selectFileldName: {
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
    selectFileldName: {
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
