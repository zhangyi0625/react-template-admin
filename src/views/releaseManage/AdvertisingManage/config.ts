import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const AdvertisingManageSearchColumns: CustomColumn[] = [
  {
    label: '广告起效时间',
    name: ['startDate', 'endDate'],
    formType: 'range-picker',
    span: 8,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const AdvertisingForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '广告标题',
    name: 'title',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '显示顺序',
    name: 'sort',
    formType: 'input-number',
    span: 12,
    isRules: true,
  },
  {
    label: '广告链接',
    name: 'link',
    formType: 'input',
    span: 12,
  },
  {
    label: '有效期间',
    name: 'date',
    formType: 'range-picker',
    span: 12,
    isRules: true,
  },
];
