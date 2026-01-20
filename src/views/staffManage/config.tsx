import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const StaffManageSearchColumns: CustomColumn[] = [
  {
    label: '手机号',
    name: 'keyword',
    formType: 'input',
    customPlaceholder: '请输入用户手机号',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const StaffManageForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '手机号',
    formType: 'input',
    span: 12,
    isRules: true,
    name: 'phone',
  },
  {
    label: '姓名',
    formType: 'input',
    span: 12,
    isRules: true,
    name: 'name',
  },
  {
    label: '公司名称',
    formType: 'input',
    span: 12,
    isRules: true,
    name: 'companyName',
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
    span: 12,
  },
];
