import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const StaffManageSearchColumns: CustomColumn[] = [
  {
    label: '手机号',
    name: 'phone',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const StaffForm: Omit<CustomColumn, 'selectFetch' | 'hiddenItem'>[] = [
  {
    label: '姓名',
    name: 'name',
    formType: 'input',
    span: 6,
    isRules: true,
  },
  {
    label: '用户手机号',
    name: 'phone',
    formType: 'input',
    span: 6,
    isRules: true,
  },
  {
    label: '职位',
    name: 'position',
    formType: 'input',
    span: 6,
    isRules: true,
  },
  {
    label: '邮箱',
    name: 'email',
    formType: 'input',
    span: 6,
  },
];
