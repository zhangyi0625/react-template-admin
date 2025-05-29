import type { CustomColumn } from '@/components/searchForm'
import {
  getSearchAffiliate,
  getSearchCustomer,
  getSearchPort,
} from '@/services/order'

export const SelectOrderOptions: CustomColumn[] = [
  {
    label: '订单号',
    name: 'orderNo',
    formType: 'input',
    span: 6,
  },
  {
    label: '公司名称',
    name: 'affiliateId',
    api: getSearchAffiliate,
    options: [],
    formType: 'select',
    span: 6,
  },
  {
    label: '用户名',
    name: 'customerId',
    api: getSearchCustomer,
    options: [],
    formType: 'input',
    span: 6,
  },
  {
    label: '订单创建时间',
    name: 'date-picker',
    formType: 'date-picker',
    span: 6,
  },
  {
    label: '起运港名称',
    name: 'porCode',
    api: getSearchPort,
    options: [],
    formType: 'select',
    span: 6,
    tag: 'POR',
  },
  {
    label: '目的港名称',
    name: 'fndCode',
    api: getSearchPort,
    options: [],
    formType: 'select',
    span: 6,
    tag: 'FND',
  },
  {
    label: '订单状态',
    name: 'status',
    formType: 'select',
    span: 6,
    publicSettingKey: 'frtOrderStatus',
  },
  {
    label: '订单分类',
    name: 'type',
    formType: 'select',
    span: 6,
    publicSettingKey: 'serviceType',
  },
  {
    label: '舱位分类',
    name: 'productChannel',
    formType: 'select',
    span: 6,
    publicSettingKey: 'productChannel',
  },
  {
    label: '取消状态',
    name: 'cancelStatus',
    formType: 'select',
    span: 6,
    publicSettingKey: 'frtOrderCancel',
  },
]
