import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const CabinTaskTemplateStatusOptions: Pick<
  CustomColumn,
  'label' | 'name'
>[] = [
  {
    label: '未启动',
    name: 'NOT_STARTED',
  },
  {
    label: '运行中',
    name: 'RUNNING',
  },
  {
    label: '已关闭',
    name: 'CLOSED',
  },
];

export const ServiceSettingType = [
  {
    label: '高频启动',
    value: 'HIGH_FREQ',
  },
  {
    label: '即可启动',
    value: 'IMMEDIATE',
  },
  {
    label: '关闭任务',
    value: 'SUSPEND',
  },
  // {
  //   label: '同频放舱',
  //   value: 'SAME_FREQ',
  // },
];

export const BOXPILE = ['20GP', '40GP', '40HQ', '45HQ', '20NOR', '40NOR'];

export const SelectCabinTaskTemplateOptions: CustomColumn[] = [
  {
    label: '客户名称',
    name: 'customerId',
    formType: 'normalSelect',
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    span: 6,
    options: [],
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '起运港',
    name: 'porCode',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '目的港',
    name: 'fndCode',
    formType: 'normalSelect',
    options: [],
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
    label: '创建时间',
    name: 'created',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];
