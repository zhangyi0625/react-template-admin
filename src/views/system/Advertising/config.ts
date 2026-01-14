import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const AdvertisingManageSearchColumns: CustomColumn[] = [
  {
    label: '有效期间',
    name: ['startDate', 'endDate'],
    formType: 'range-picker',
    span: 8,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const AdvertisingManageForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '广告标题',
    formType: 'input',
    span: 12,
    isRules: true,
    name: 'title',
  },
  {
    label: '显示顺序',
    formType: 'input-number',
    span: 12,
    isRules: true,
    name: 'sort',
  },
  {
    label: '广告链接',
    formType: 'input',
    span: 12,
    name: 'link',
  },
  {
    label: '广告图片',
    name: 'fileList',
    formType: 'upload',
    span: 12,
  },
  {
    label: '有效期间',
    name: 'create',
    formType: 'range-picker',
    span: 12,
    isRules: true,
  },
];
