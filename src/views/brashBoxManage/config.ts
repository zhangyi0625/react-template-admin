import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const BrashBoxListSearchColumns: CustomColumn[] = [
  {
    label: '客户名称',
    name: 'customerName',
    formType: 'input',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '手机号',
    name: 'customerPhone',
    formType: 'input',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '提单号',
    name: 'billNo',
    formType: 'input',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '创建时间',
    name: 'createTime',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const BrashBoxAccountSearchColumns: CustomColumn[] = [
  {
    label: '账号名',
    name: 'account',
    formType: 'input',
    options: [],
    customPlaceholder: '请输入账号名',
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
    name: 'billNo',
    formType: 'input',
    span: 24,
    isRules: true,
  },
  {
    label: '总箱量',
    name: 'totalNumber',
    formType: 'input-number',
    options: [],
    isRules: true,
    span: 24,
  },
  {
    label: '箱型',
    name: 'ctnType',
    formType: 'normalSelect',
    options: [
      {
        label: '20GP',
        value: '20GP',
      },
      {
        label: '40GP',
        value: '40GP',
      },
      {
        label: '40HQ',
        value: '40HQ',
      },
      {
        label: '45HQ',
        value: '45HQ',
      },
    ],
    span: 24,
    isRules: true,
  },
  {
    label: '本次刷箱量',
    name: 'ctnNumber',
    formType: 'input-number',
    options: [],
    isRules: true,
    span: 24,
  },
];

export const BrashBoxAccountForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
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
  {
    label: '状态',
    name: 'status',
    formType: 'radio',
    options: [
      {
        label: '有效',
        value: 1,
      },
      {
        label: '无效',
        value: 0,
      },
    ],
    span: 24,
  },
  {
    label: '备注',
    name: 'remark',
    formType: 'textarea',
    options: [],
    span: 24,
  },
];
