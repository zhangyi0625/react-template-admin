import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const NoticeSearchColumns: CustomColumn[] = [
  {
    label: '有效期间',
    name: ['startDate', 'endDate'],
    formType: 'range-picker',
    span: 8,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const NoticeForms: Omit<CustomColumn, 'selectFetch' | 'hiddenItem'>[] = [
  {
    label: '公告标题',
    formType: 'input',
    span: 12,
    isRules: true,
    name: 'title',
  },
  {
    label: '公告内容',
    formType: 'textarea',
    span: 12,
    isRules: true,
    name: 'content',
  },
  {
    label: '有效期间',
    name: 'create',
    formType: 'range-picker',
    span: 12,
    isRules: true,
  },
];
