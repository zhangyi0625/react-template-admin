import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const BillManageSearchColumns: CustomColumn[] = [
  {
    label: '创建时间',
    name: 'create',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];
