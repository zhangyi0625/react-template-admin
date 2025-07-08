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

export const ShippingAccountForm: CustomColumn[] = [
  {
    label: '账号类型',
    name: 'accountType',
    formType: 'radio',
    options: [
      {
        label: '查询',
        value: 'search',
      },
      { label: '下单', value: 'order' },
    ],
    span: 12,
  },
  {
    label: '船公司',
    name: 'carrier',
    formType: 'select',
    span: 12,
  },
  {
    label: '客户名称',
    name: 'customer',
    formType: 'input',
    span: 12,
  },
  {
    label: '船司账号',
    name: 'account',
    formType: 'input',
    span: 12,
  },
  {
    label: '账号抬头',
    name: 'accountHeader',
    formType: 'input',
    span: 12,
  },
  {
    label: '登录密码',
    name: 'password',
    formType: 'input',
    span: 12,
  },
  {
    label: '支付密码',
    name: 'payPassword',
    formType: 'input',
    span: 12,
  },
]
