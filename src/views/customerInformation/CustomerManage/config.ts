import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const SelectCustomerManageOptions: CustomColumn[] = [
  {
    label: '客户名称',
    name: 'name',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
]

export const CustomerManageForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '客户名称',
    name: 'name',
    formType: 'input',
    span: 12,
  },
  {
    label: '客户简称',
    name: 'shortName',
    formType: 'input',
    span: 12,
  },
  {
    label: '统一社会信用代码',
    name: 'socialCode',
    formType: 'input',
    span: 12,
  },
]
