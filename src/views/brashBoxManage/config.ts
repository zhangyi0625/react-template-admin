import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const BrashBoxListSearchColumns: CustomColumn[] = [
  {
    label: '提单号',
    name: 'no',
    formType: 'input',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '船公司',
    name: 'carrier',
    formType: 'normalSelect',
    options: [],
    selectFieldName: {
      label: 'code',
      value: 'code',
    },
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '船名',
    name: 'vesselName',
    formType: 'input',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '航次',
    name: 'voyNo',
    formType: 'input',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '创建时间',
    name: 'create',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const BrashBoxAccountSearchColumns: CustomColumn[] = [
  {
    label: '船公司',
    name: 'carrier',
    formType: 'normalSelect',
    options: [],
    selectFieldName: {
      label: 'code',
      value: 'code',
    },
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const BrashBoxListForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '提单号',
    name: 'no',
    formType: 'input',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '船司代码',
    name: 'carrier',
    formType: 'input',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '船名',
    name: 'vesselName',
    formType: 'input',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '航次',
    name: 'voyNo',
    formType: 'input',
    options: [],
    span: 12,
    isRules: true,
  },
  // {
  //   label: '提单号',
  //   name: 'no',
  //   formType: 'input',
  //   options: [],
  //   span: 12,
  //       isRules: true,
  // },
  {
    label: '箱型',
    name: 'ctnType',
    formType: 'input',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '邮箱',
    name: 'email',
    formType: 'input',
    options: [],
    span: 12,
  },
  {
    label: '货代一代',
    name: 'name',
    formType: 'input',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '提箱码',
    name: 'code',
    formType: 'input',
    options: [],
    span: 12,
  },
  {
    label: '刷箱账号',
    name: 'account',
    formType: 'input',
    options: [],
    span: 12,
  },
];

export const BrashBoxAccountForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '船公司',
    name: 'carrier',
    formType: 'input',
    options: [],
    span: 24,
    isRules: true,
  },
  {
    label: '货代',
    name: 'name',
    formType: 'input',
    options: [],
    span: 24,
  },
  {
    label: '账号',
    name: 'account',
    formType: 'input',
    options: [],
    span: 24,
    isRules: true,
  },
  {
    label: '密码',
    name: 'password',
    formType: 'input',
    options: [],
    span: 24,
    isRules: true,
  },
];
