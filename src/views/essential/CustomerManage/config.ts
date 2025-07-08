import { CustomColumn } from '@/components/searchForm'

export const SelectCustomerManageOptions: CustomColumn[] = [
  {
    label: '客户名称',
    name: 'customer',
    formType: 'input',
    span: 6,
  },
]

export const CustomerManageForm: CustomColumn[] = [
  {
    label: '客户名称',
    name: 'customerName',
    formType: 'input',
    span: 12,
  },
  {
    label: '客户简称',
    name: 'customer',
    formType: 'input',
    span: 12,
  },
  {
    label: '统一社会信用代码',
    name: 'code',
    formType: 'input',
    span: 12,
  },
]
