import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const NoticeManageForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '公告标题',
    name: 'title',
    formType: 'input',
    span: 6,
    isRules: true,
  },
  {
    label: '公告类型',
    name: 'type',
    formType: 'radio',
    options: [
      {
        label: '移动端首页顶部',
        value: 'MOBILE_HOME_TOP',
      },
    ],
    defaultValue: 'MOBILE_HOME_TOP',
    span: 6,
  },
  {
    label: '有效开始时间',
    name: 'validFrom',
    formType: 'date-picker',
    span: 6,
    isRules: true,
  },
  {
    label: '有效结束时间',
    name: 'validTo',
    formType: 'date-picker',
    span: 6,
    isRules: true,
  },
  {
    label: '显示顺序',
    name: 'sequence',
    formType: 'inputNumber',
    span: 6,
    isRules: true,
  },
];
