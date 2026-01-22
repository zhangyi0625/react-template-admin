import type { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const BoxPileManageStatusOptions: SelectProps['options'] = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '禁用',
    value: 0,
  },
];

export const BoxPileManageSearchColumns: CustomColumn[] = [
  {
    label: '状态',
    name: 'enabled',
    formType: 'normalSelect',
    options: BoxPileManageStatusOptions,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const BoxPileManageForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '箱型编码',
    name: 'code',
    formType: 'input',
    span: 6,
    isRules: true,
  },
  {
    label: '箱型名称',
    name: 'name',
    formType: 'input',
    span: 6,
    isRules: true,
  },
  {
    label: '排序',
    name: 'sort',
    formType: 'input-number',
    span: 6,
  },
  {
    label: '状态',
    name: 'enabled',
    formType: 'radio',
    options: BoxPileManageStatusOptions,
    span: 6,
    isRules: true,
  },
];
