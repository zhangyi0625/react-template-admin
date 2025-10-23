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

export const ShipownerEncyclopediaForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '英文名称',
    name: 'officialName',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '中文名称',
    name: 'localName',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '官网地址',
    name: 'websiteUrl',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '货物跟踪地址',
    name: 'addressUrl',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '船司简介',
    name: 'description',
    formType: 'textarea',
    span: 24,
    isRules: true,
  },
];

export const ShipownerEncyclopediaOfficesForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '名称',
    name: 'name',
    formType: 'input',
    span: 12,
  },
  {
    label: '电话',
    name: 'tel',
    formType: 'input',
    span: 12,
  },
  {
    label: '传真',
    name: 'fax',
    formType: 'input',
    span: 12,
  },
  {
    label: '地址',
    name: 'address',
    formType: 'input',
    span: 12,
  },
  {
    label: '邮件',
    name: 'email',
    formType: 'input',
    span: 12,
  },
];
