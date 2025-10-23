import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const SelectRouteManageOptions: CustomColumn[] = [
  {
    label: '航线',
    name: 'routeName',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '目的港',
    name: 'fnds',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];
