import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const IndustryDynamicsSearchColumns: CustomColumn[] = [
  {
    label: '栏目',
    name: 'groupId',
    formType: 'normalSelect',
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const IndustryDynamicsProgramForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '栏目名称',
    name: 'name',
    formType: 'input',
    span: 6,
    isRules: true,
  },
];
