import type { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { getSearchCarrier } from '@/services/orderManage/regularBooking/regularBookingApi';
import { changeSelectOptionsByLabel } from '@/utils/options';

export const FreightTaskConfigurationSource: SelectProps['options'] = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '壹沓',
    value: 'Y_DATA',
  },
  {
    label: '船司引擎',
    value: 'CARRIER_ENGINE',
  },
];

export const FreightTaskConfigurationSearchColumns: CustomColumn[] = [
  {
    label: '船公司',
    name: 'carrierCode',
    formType: 'normalSelect',
    options: [],
    api: getSearchCarrier,
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
    label: '来源',
    name: 'source',
    formType: 'normalSelect',
    options: FreightTaskConfigurationSource,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    defaultValue: '',
  },
  {
    label: '状态',
    name: 'isEnabled',
    formType: 'normalSelect',
    options: changeSelectOptionsByLabel(['开启', '关闭']),
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    defaultValue: 0,
  },
];

export const FreightTaskConfigurationForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '船公司',
    name: 'carrierCode',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFileldName: {
      label: 'carrierCode',
      value: 'carrierCode',
    },
  },
  {
    label: '起运港',
    name: 'porCode',
    formType: 'focusSelect',
    options: [],
    span: 6,
  },
  {
    label: '目的港',
    name: 'fndCode',
    formType: 'focusSelect',
    options: [],
    span: 6,
  },
  {
    label: '运输条款',
    name: 'transClause',
    formType: 'normalSelect',
    options: [
      {
        label: 'CY-CY',
        value: 'CY-CY',
      },
      {
        label: 'CY-SD',
        value: 'CY-SD',
      },
    ],
    span: 6,
  },
  {
    label: '来源',
    name: 'source',
    formType: 'normalSelect',
    options: FreightTaskConfigurationSource.filter((item) => item.value),
    span: 6,
  },
  {
    label: '船司账号',
    name: 'username',
    formType: 'input',
    span: 6,
  },
  {
    label: '船司账号密码',
    name: 'password',
    formType: 'input',
    span: 6,
  },
  {
    label: 'etd相距天数',
    name: 'etdOffsetDay',
    formType: 'input',
    span: 6,
  },
];
