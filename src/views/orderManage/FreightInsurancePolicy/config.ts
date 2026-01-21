import { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const FreightInsurancePolicyOpStatusOptions: SelectProps['options'] = [
  {
    value: '01',
    label: '草稿',
  },
  {
    value: '02',
    label: '已提交',
  },
  {
    value: '03',
    label: '录单中',
  },
  {
    value: '04',
    label: '已出单',
  },
  {
    value: '05',
    label: '重新处理',
  },
  {
    value: '06',
    label: '已退回',
  },
  {
    value: '07',
    label: '撤单',
  },
  {
    value: '08',
    label: '客户删除草稿件',
  },
];

export const FreightInsurancePolicySearchColumns: CustomColumn[] = [
  {
    label: '投保单号',
    name: 'applyno',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '保单号',
    name: 'policy',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '被保险人',
    name: 'insuredname',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '目的地',
    name: 'destination',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '出单状态',
    name: 'opstatus',
    formType: 'normalSelect',
    options: FreightInsurancePolicyOpStatusOptions,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '发票号',
    name: 'no',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '提单号',
    name: 'billno',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '投保人',
    name: 'customerName',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '起运日期',
    name: ['createStart', 'createEnd'],
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '出单日期',
    name: ['commitdateStart', 'commitdateEnd'],
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];
