// import { CustomColumn } from '@/components/searchForm'
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const SelectCabinTaskTemplateOptions: CustomColumn[] = [
  {
    label: '客户名称',
    name: 'customerId',
    formType: 'normalSelect',
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
    label: 'ETD',
    name: 'etd',
    formType: 'date-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '创建时间',
    name: 'created',
    formType: 'date-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
]

export const CabinTaskTemplateStatusOptions: Pick<
  CustomColumn,
  'label' | 'name'
>[] = [
  {
    label: '未启动',
    name: 'NOT_STARTED',
  },
  {
    label: '运行中',
    name: 'RUNNING',
  },
  {
    label: '已关闭',
    name: 'CLOSED',
  },
]
