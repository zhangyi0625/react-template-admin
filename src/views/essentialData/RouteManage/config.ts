import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const SelectRouteManageOptions: CustomColumn[] = [
  {
    label: '航线',
    name: 'name',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];
