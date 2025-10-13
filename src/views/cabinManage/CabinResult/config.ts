import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const SelectCabinResultOptions: CustomColumn[] = [
  {
    label: '任务编号',
    name: 'no',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '客户名称',
    name: 'customerId',
    formType: 'normalSelect',
    options: [],
    selectFileldName: {
      label: 'name',
      value: 'id',
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
    label: '订舱时间',
    name: 'createTime',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
]
