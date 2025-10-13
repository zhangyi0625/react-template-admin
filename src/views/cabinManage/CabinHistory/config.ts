import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const SelectCabinHistoryOptions: CustomColumn[] = [
  {
    label: '起运港',
    name: 'porCode',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '目的港',
    name: 'fndCode',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '细分航线',
    name: 'router',
    formType: 'normalSelect',
    options: [],
    selectFileldName: {
      label: 'routeName',
      value: 'id',
    },
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '放舱日期',
    name: 'create',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
]
