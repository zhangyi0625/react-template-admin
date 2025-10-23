import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const SelectStaffOptions: CustomColumn[] = [
  {
    label: '员工名称',
    name: 'name',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '用户名',
    name: 'username',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '状态',
    name: 'valid',
    formType: 'normalSelect',
    options: [
      {
        label: '全部',
        value: '',
      },
      {
        label: '可用',
        value: 1,
      },
      {
        label: '禁用',
        value: 0,
      },
    ],
    defaultValue: '',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '部门',
    name: 'roleId',
    formType: 'focusSelect',
    options: [],
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
    apiByUrl: '/api/staff/staff/role/list',
    apiByUrlMethod: 'get',
    setSearchKey: 'name',
    apiByUrlParams: {
      name: null,
    },
    apiByUrlHeaders: {
      authorization: 'Bearer ' + sessionStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    span: 6,
    selectFetch: true,
    hiddenItem: false,
  },
];

export const SelectStaffForm: Omit<CustomColumn, 'selectFetch'>[] = [
  {
    label: '员工名称',
    name: 'name',
    formType: 'input',
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '手机号',
    name: 'phone',
    formType: 'input',
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '用户名',
    name: 'username',
    formType: 'input',
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '状态',
    name: 'valid',
    formType: 'normalSelect',
    options: [
      {
        label: '可用',
        value: 1,
      },
      {
        label: '禁用',
        value: 0,
      },
    ],
    defaultValue: '',
    span: 12,
    hiddenItem: false,
  },
  {
    label: '密码',
    name: 'password',
    formType: 'input',
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '部门',
    name: 'roleId',
    formType: 'normalSelect',
    options: [],
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
    span: 12,
    hiddenItem: false,
  },
  {
    label: '备注',
    name: 'remarks',
    formType: 'textarea',
    span: 12,
    isRules: false,
    hiddenItem: false,
  },
];
