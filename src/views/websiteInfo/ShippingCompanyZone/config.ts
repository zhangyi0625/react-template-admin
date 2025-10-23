import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const ShippingCompanyZoneColumns: CustomColumn[] = [
  {
    label: '船司代码',
    name: 'code',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    customPlaceholder: '船司代码',
  },
  {
    label: '船司名称',
    name: 'name',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    customPlaceholder: '船司名称',
  },
];

export const ShippingCompanyZoneForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '船司代码',
    name: 'code',
    formType: 'input',
    span: 6,
  },
  {
    label: '船司名称',
    name: 'name',
    formType: 'input',
    span: 6,
  },
  {
    label: '船司简称',
    name: 'shortName',
    formType: 'input',
    span: 6,
  },
];
