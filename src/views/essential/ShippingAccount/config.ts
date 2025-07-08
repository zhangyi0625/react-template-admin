import { CustomColumn } from '@/components/searchForm'

export const SelectShippingAccountOptions: CustomColumn[] = [
  {
    label: '船公司',
    name: 'carrier',
    formType: 'select',
    options: [],
    span: 6,
  },
  {
    label: '客户名称',
    name: 'customer',
    formType: 'input',
    span: 6,
  },
  {
    label: '船司账号',
    name: 'carrierAccount',
    formType: 'input',
    span: 6,
  },
]
