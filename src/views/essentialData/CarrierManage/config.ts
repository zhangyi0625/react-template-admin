import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'
import { PortSettingSelect } from '../PortManage/config'
import { replaceObjectName } from '@/utils/tool'

export const SelectCarrierManageOptions: CustomColumn[] = [
  {
    label: '船司代码',
    name: 'code',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
]

export const CarrierManageForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '船司代码',
    name: 'code',
    formType: 'input',
    span: 12,
  },
  {
    label: '船司中文名',
    name: 'cnName',
    formType: 'input',
    span: 12,
  },
  {
    label: '船司英文名',
    name: 'enName',
    formType: 'input',
    span: 12,
  },
  {
    label: '船司logo',
    name: 'logoUrl',
    formType: 'upload',
    span: 12,
  },
  {
    label: '状态',
    name: 'enabled',
    formType: 'radio',
    options: replaceObjectName(
      PortSettingSelect['enabled'],
      ['label', 'value'],
      ['name', 'id']
    ),
    span: 12,
  },
]
