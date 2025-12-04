import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const FinancialDetailsSearchColumns: CustomColumn[] = [
  {
    label: '公司名称',
    name: 'affiliateId',
    formType: 'focusSelect',
    options: [],
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
    apiByUrl: '/api/staff/customer/affiliate/list',
    apiByUrlMethod: 'get',
    setSearchKey: 'keyword',
    apiByUrlParams: {
      keyword: null,
    },
    apiByUrlHeaders: {
      authorization: 'Bearer ' + sessionStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    span: 6,
    selectFetch: true,
    hiddenItem: false,
  },
  {
    label: '用户名',
    name: 'customerId',
    formType: 'focusSelect',
    options: [],
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
    apiByUrl: '/api/staff/customer/list',
    apiByUrlMethod: 'get',
    setSearchKey: 'keyword',
    apiByUrlParams: {
      keyword: null,
    },
    apiByUrlHeaders: {
      authorization: 'Bearer ' + sessionStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    span: 6,
    selectFetch: true,
    hiddenItem: false,
  },
  {
    label: '资金类型',
    name: 'fund',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '创建时间',
    name: 'created',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const FinancialDetailsForms: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '公司名称',
    name: 'affiliateId',
    formType: 'focusSelect',
    options: [],
    span: 12,
    customPlaceholder: '请输入公司名称',
  },
  {
    label: '用户名',
    name: 'customerId',
    formType: 'focusSelect',
    options: [],
    span: 12,
    customPlaceholder: '请输入用户名',
  },
  {
    label: '流水号',
    name: 'paymentNo',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '创建时间',
    name: 'create',
    formType: 'date-picker',
    span: 12,
    isRules: true,
  },
  {
    label: '付款方式',
    name: 'fundType',
    formType: 'normalSelect',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '业务归属',
    name: 'paymentWay',
    formType: 'normalSelect',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '付款账号',
    name: 'paymentPayer',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '付款金额',
    name: 'amount',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '收款账号',
    name: 'paymentPayee',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '付款时间',
    name: 'accomplished',
    formType: 'date-picker',
    span: 12,
    isRules: true,
  },
];
