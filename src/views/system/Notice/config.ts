import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const NoticeSearchColumns: CustomColumn[] = [
  // {
  //   label: '状态',
  //   formType: 'normalSelect',
  //   span: 6,
  //   selectFetch: false,
  //   hiddenItem: false,
  //   customPlaceholder: '请选择状态',
  //   options: [
  //     {
  //       label: '已发布',
  //       value: 1,
  //     },
  //     {
  //       label: '草稿',
  //       value: 0,
  //     },
  //   ],
  // },
  {
    label: '有效期间',
    name: ['startDate', 'endDate'],
    formType: 'range-picker',
    span: 8,
    isRules: true,
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
