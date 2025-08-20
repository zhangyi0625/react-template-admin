import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const SelectTodayPlanOptions: CustomColumn[] = [
  {
    label: '船公司',
    name: 'carrier',
    formType: 'normalSelect',
    options: [],
    selectFileldName: {
      label: 'code',
      value: 'code',
    },
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
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
]
